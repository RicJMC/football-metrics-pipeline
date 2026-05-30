const puppeteer = require('puppeteer');
const fs = require('fs');
const { parse } = require('json2csv');

// Função principal
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });

  const seasons = [
    // '2017-2018',
    // '2018-2019',
    // '2019-2020',
    // '2020-2021',
    // '2021-2022',
    // '2022-2023',
    '2023-2024'];
  
  const league = 'European-Leagues'; // Cinco grandes ligas europeias
  const competitionId = 'Big5'; // ID da competição das cinco grandes ligas
  const categories = [
    'standard',
    'keeper_adv',
    'shooting',
    'passing',
    'gca',
    'defense',
    'possession',
    'misc'
  ];

  // Array para armazenar todas as promessas de extração de categoria
  const extractionPromises = [];

  // Iterar sobre cada temporada, categoria e extrair os dados
  for (const season of seasons) {
    for (const category of categories) {
      let url;
      if (category === 'standard') {
        url = `https://fbref.com/en/comps/${competitionId}/${season}/stats/players/${season}-${competitionId}-${league}-Stats`;
      } else if (category === 'keeper_adv') {
        url = `https://fbref.com/en/comps/${competitionId}/${season}/keepersadv/players/${season}-${competitionId}-${league}-Stats`;
      } else {
        url = `https://fbref.com/en/comps/${competitionId}/${season}/${category}/players/${season}-${competitionId}-${league}-Stats`;
      }
      const extractionPromise = extractCategory(browser, url, category, season, league, competitionId);
      extractionPromises.push(extractionPromise);
    }
  }

  // Esperar que todas as promessas de extração de categoria sejam resolvidas
  await Promise.all(extractionPromises);

  console.log('Extração de dados concluída para todas as categorias e temporadas.');

  // Fechar o navegador após todas as operações serem concluídas
  await browser.close();
})();

// Função para extrair dados de uma categoria e salvar em JSON e CSV
const extractCategory = async (browser, url, category, season, league, competitionId) => {
  console.log(`Extraindo dados da categoria ${category} das ${league} na temporada ${season}...`);
  const page = await browser.newPage();
  await page.goto(url, { timeout: 180000 });

  try {
    await page.waitForSelector(`#stats_${category}_per_match_toggle`, { timeout: 5000 });
    console.log(`Botão da categoria ${category} encontrado.`);
    
    await clickButton(page, `#stats_${category}_per_match_toggle`);
    console.log(`Botão da categoria ${category} clicado.`);
    
    const columnNames = await extractColumnNames(page, `#stats_${category}`);
    const data = await extractData(page, `#stats_${category}`, columnNames);
    await saveData(data, category, season, league, competitionId);
    console.log(`Dados da categoria ${category} das ${league} na temporada ${season} extraídos e salvos.`);
  } catch (error) {
    console.error(`Erro ao extrair dados da categoria ${category} das ${league} na temporada ${season}: ${error}`);
  } finally {
    await page.close();
  }
};

// Função para clicar no botão de uma categoria
const clickButton = async (page, selector) => {
  console.log(`Clicando no botão ${selector}...`);
  await page.evaluate((selector) => {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
    } else {
      throw new Error(`Botão ${selector} não encontrado.`);
    }
  }, selector);
};

// Função para extrair os nomes das colunas de uma categoria
const extractColumnNames = async (page, selector) => {
  console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
  return await page.evaluate((selector) => {
    const columnElements = document.querySelectorAll(`${selector} th:not(.over_header)`);
    const columnNames = Array.from(columnElements).map((th) => th.innerText.trim());
    console.log(`Nomes das colunas extraídos: ${columnNames}`);
    return columnNames;
  }, selector);
};

// Função para extrair dados de uma categoria
const extractData = async (page, selector, columnNames) => {
  console.log(`Extraindo dados para a categoria ${selector}...`);
  return await page.evaluate((selector) => {
    const tableRows = document.querySelectorAll(`${selector} tbody tr`);
    const rowData = [];

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const rowDataItem = {};

      rowDataItem['Rk'] = row.getAttribute('data-row');
      rowDataItem['PlayerCode'] = row.getAttribute('data-append-csv');

      cells.forEach((cell, index) => {
        const columnStat = cell.getAttribute('data-stat');
        rowDataItem[columnStat] = cell.innerText.trim();
      });

      rowData.push(rowDataItem);
    });

    console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
    return rowData;
  }, selector);
};

// Função para salvar dados em JSON e CSV
const saveData = async (data, category, season, league, competitionId) => {
  console.log(`Salvando dados da categoria ${category} das ${league} na temporada ${season}...`);
  const directoryPath = `../data/${competitionId}-${league}/${season}/${category}/`;

  try {
    fs.mkdirSync(directoryPath, { recursive: true });

    fs.writeFileSync(
      `${directoryPath}${season}-${league}-${category}.json`,
      JSON.stringify(data, null, 2),
    );
    const csv = parse(data);
    fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
    console.log(`Dados da categoria ${category} das ${league} na temporada ${season} salvos.`);
  } catch (error) {
    console.error(`Erro ao salvar dados da categoria ${category} das ${league} na temporada ${season}: ${error}`);
  }
};