const puppeteer = require('puppeteer');
const fs = require('fs');
const { parse } = require('json2csv');

// Função principal
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();
  await page.goto('https://fbref.com/en/comps/32/passing/Primeira-Liga-Stats');

  // Executa a função para clicar no botão e exibir os dados desejados
  await clickButton(page);

  // Executa a função para extrair e gravar os dados da tabela
  await extractAndSaveData(page);

  // Fecha o navegador após todas as operações serem concluídas
  await browser.close();
})();

// Função para clicar no botão
const clickButton = async (page) => {
  await page.waitForSelector('#stats_passing_per_match_toggle');
  await page.evaluate(() => {
    document.querySelector('#stats_passing_per_match_toggle').click();
  });
  console.log('Botão clicado com sucesso!');
};

// Função para extrair e gravar os dados da tabela
const extractAndSaveData = async (page) => {
  // Extrair nomes das colunas
  const columnNames = await extractColumnNames(page);

  // Extrair dados da tabela
  const data = await extractData(page, columnNames);

  // Visualiza os dados no console
  console.log(data);

  // Grava os dados em JSON
  fs.writeFileSync('passing.json', JSON.stringify(data, null, 2));
  
  // Converte os dados para CSV e grava em arquivo
  const csv = parse(data);
  fs.writeFileSync('passing.csv', csv);
};

// Função para extrair os nomes das colunas
const extractColumnNames = async (page) => {
  return await page.evaluate(() => {
    const columnElements = document.querySelectorAll('#stats_passing th:not(.over_header)');
    const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
    return columnNames;
  });
};

// Função para extrair dados da tabela
// Função para extrair dados da tabela
const extractData = async (page) => {
  return await page.evaluate(() => {
      const tableRows = document.querySelectorAll('#stats_passing tbody tr');
      const rowData = [];

      tableRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const rowDataItem = {};

          // Extrair o valor de Rk
          rowDataItem['Rk'] = row.getAttribute('data-row');

          // Extrair o código do jogador
          rowDataItem['PlayerCode'] = row.getAttribute('data-append-csv');

          // Extrair os dados das colunas
          cells.forEach((cell, index) => {
              const columnStat = cell.getAttribute('data-stat');
              rowDataItem[columnStat] = cell.innerText.trim();
          });

          // Adicionar o objeto de dados da linha ao array de dados
          rowData.push(rowDataItem);
      });

      return rowData;
  });
};
