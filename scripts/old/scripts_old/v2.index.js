const puppeteer = require('puppeteer');
const fs = require('fs');
const { parse } = require('json2csv');

// Lista de URLs das categorias
const categoryUrls = [
  { url: 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats', category: 'standard' },
  { url: 'https://fbref.com/en/comps/32/shooting/Primeira-Liga-Stats', category: 'shooting' },
  { url: 'https://fbref.com/en/comps/32/passing/Primeira-Liga-Stats', category: 'passing' },
  { url: 'https://fbref.com/en/comps/32/gca/Primeira-Liga-Stats', category: 'gca' },
  { url: 'https://fbref.com/en/comps/32/defense/Primeira-Liga-Stats', category: 'defense' },
  { url: 'https://fbref.com/en/comps/32/possession/Primeira-Liga-Stats', category: 'possession' }
];

// Função principal
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });

  // Array para armazenar todas as promessas de extração de categoria
  const extractionPromises = [];

  // Extrair dados para cada categoria
  for (const category of categoryUrls) {
    const extractionPromise = extractCategory(browser, category.url, category.category);
    extractionPromises.push(extractionPromise);
  }

  // Esperar que todas as promessas de extração de categoria sejam resolvidas
  await Promise.all(extractionPromises);

  console.log("Extração de dados concluída para todas as categorias.");

  // Fechar o navegador após todas as operações serem concluídas
  await browser.close();
})();

// Função para extrair dados de uma categoria e salvar em JSON e CSV
const extractCategory = async (browser, url, category) => {
  const page = await browser.newPage();
  await page.goto(url);
  await clickButton(page, `#stats_${category}_per_match_toggle`);
  const columnNames = await extractColumnNames(page, `#stats_${category}`);
  const data = await extractData(page, `#stats_${category}`, columnNames);
  await saveData(data, category);
  console.log(`Dados da categoria ${category} extraídos e salvos.`);
  await page.close(); // Fecha a página após a extração estar completa
};

// Função para clicar no botão de uma categoria
const clickButton = async (page, selector) => {
  await page.waitForSelector(selector);
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
  console.log('Botão clicado com sucesso!');
};

// Função para extrair os nomes das colunas de uma categoria
const extractColumnNames = async (page, selector) => {
  return await page.evaluate((selector) => {
    const columnElements = document.querySelectorAll(`${selector} th:not(.over_header)`);
    const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
    return columnNames;
  }, selector);
};

// Função para extrair dados de uma categoria
const extractData = async (page, selector, columnNames) => {
  return await page.evaluate((selector) => {
    const tableRows = document.querySelectorAll(`${selector} tbody tr`);
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
  }, selector);
};

// Função para salvar dados em JSON e CSV
const saveData = async (data, category) => {
  // Salva os arquivos JSON e CSV
  fs.writeFileSync(`./data/json/${category}.json`, JSON.stringify(data, null, 2));
  const csv = parse(data);
  fs.writeFileSync(`./data/csv/${category}.csv`, csv);
};



// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Lista de URLs das categorias
// const categoryUrls = [
//   { url: 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats', category: 'standard' },
//   { url: 'https://fbref.com/en/comps/32/shooting/Primeira-Liga-Stats', category: 'shooting' },
//   { url: 'https://fbref.com/en/comps/32/passing/Primeira-Liga-Stats', category: 'passing' },
//   { url: 'https://fbref.com/en/comps/32/gca/Primeira-Liga-Stats', category: 'gca' },
//   { url: 'https://fbref.com/en/comps/32/defense/Primeira-Liga-Stats', category: 'defense' },
//   { url: 'https://fbref.com/en/comps/32/possession/Primeira-Liga-Stats', category: 'possession' }
// ];

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });

//   // Extrair dados para cada categoria
//   for (const category of categoryUrls) {
//     await extractCategory(browser, category.url, category.category);
//   }

//   // Fecha o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category) => {
//   const page = await browser.newPage();
//   await page.goto(url);
//   await clickButton(page, `#stats_${category}_per_match_toggle`);
//   const columnNames = await extractColumnNames(page, `#stats_${category}`);
//   const data = await extractData(page, `#stats_${category}`, columnNames);
//   await saveData(data, category);
//   console.log(`Dados da categoria ${category} extraídos e salvos.`);
//   await page.close(); // Fecha a página após a extração estar completa

//   // Se houver mais categorias, extrai a próxima recursivamente
//   const nextCategoryIndex = categoryUrls.findIndex(item => item.category === category) + 1;
//   if (nextCategoryIndex < categoryUrls.length) {
//     const nextCategory = categoryUrls[nextCategoryIndex];
//     await extractCategory(browser, nextCategory.url, nextCategory.category);
//   }
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   await page.waitForSelector(selector);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(`${selector} th:not(.over_header)`);
//     const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};

//       // Extrair o valor de Rk
//       rowDataItem['Rk'] = row.getAttribute('data-row');

//       // Extrair o código do jogador
//       rowDataItem['PlayerCode'] = row.getAttribute('data-append-csv');

//       // Extrair os dados das colunas
//       cells.forEach((cell, index) => {
//         const columnStat = cell.getAttribute('data-stat');
//         rowDataItem[columnStat] = cell.innerText.trim();
//       });

//       // Adicionar o objeto de dados da linha ao array de dados
//       rowData.push(rowDataItem);
//     });

//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category) => {
//   // Salva os arquivos JSON e CSV
//   fs.writeFileSync(`./data/json/${category}.json`, JSON.stringify(data, null, 2));
//   const csv = parse(data);
//   fs.writeFileSync(`./data/csv/${category}.csv`, csv);
// };


// // const puppeteer = require('puppeteer');
// // const fs = require('fs');
// // const { parse } = require('json2csv');

// // // Função principal
// // (async () => {
// //   const browser = await puppeteer.launch({
// //     headless: false,
// //     defaultViewport: false,
// //     userDataDir: "./tmp"
// //   });

// //   // Extrair dados para cada categoria
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats', 'standard');
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/shooting/Primeira-Liga-Stats', 'shooting');
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/passing/Primeira-Liga-Stats', 'passing');
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/gca/Primeira-Liga-Stats', 'gca');
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/defense/Primeira-Liga-Stats', 'defense');
// //   await extractCategory(browser, 'https://fbref.com/en/comps/32/possession/Primeira-Liga-Stats', 'possession');

// //   // Fecha o navegador após todas as operações serem concluídas
// //   await browser.close();
// // })();

// // // Função para extrair dados de uma categoria e salvar em JSON e CSV
// // const extractCategory = async (browser, url, category) => {
// //   const page = await browser.newPage();
// //   await page.goto(url);
// //   await clickButton(page, `#stats_${category}_per_match_toggle`);
// //   const columnNames = await extractColumnNames(page, `#stats_${category}`);
// //   const data = await extractData(page, `#stats_${category}`, columnNames);
// //   await saveData(data, category);
// //   console.log(`Dados da categoria ${category} extraídos e salvos.`);
// // };

// // // Função para clicar no botão de uma categoria
// // const clickButton = async (page, selector) => {
// //   await page.waitForSelector(selector);
// //   await page.evaluate((selector) => {
// //     document.querySelector(selector).click();
// //   }, selector);
// //   console.log('Botão clicado com sucesso!');
// // };

// // // Função para extrair os nomes das colunas de uma categoria
// // const extractColumnNames = async (page, selector) => {
// //   return await page.evaluate((selector) => {
// //     const columnElements = document.querySelectorAll(`${selector} th:not(.over_header)`);
// //     const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
// //     return columnNames;
// //   }, selector);
// // };

// // // Função para extrair dados de uma categoria
// // const extractData = async (page, selector, columnNames) => {
// //   return await page.evaluate((selector) => {
// //     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
// //     const rowData = [];

// //     tableRows.forEach(row => {
// //       const cells = row.querySelectorAll('td');
// //       const rowDataItem = {};

// //       // Extrair o valor de Rk
// //       rowDataItem['Rk'] = row.getAttribute('data-row');

// //       // Extrair o código do jogador
// //       rowDataItem['PlayerCode'] = row.getAttribute('data-append-csv');

// //       // Extrair os dados das colunas
// //       cells.forEach((cell, index) => {
// //         const columnStat = cell.getAttribute('data-stat');
// //         rowDataItem[columnStat] = cell.innerText.trim();
// //       });

// //       // Adicionar o objeto de dados da linha ao array de dados
// //       rowData.push(rowDataItem);
// //     });

// //     return rowData;
// //   }, selector);
// // };

// // // Função para salvar dados em JSON e CSV
// // const saveData = async (data, category) => {
// //   // Salva os arquivos JSON e CSV
// //   fs.writeFileSync(`./data/json/${category}.json`, JSON.stringify(data, null, 2));
// //   const csv = parse(data);
// //   fs.writeFileSync(`./data/csv/${category}.csv`, csv);
// // };





// // // const puppeteer = require('puppeteer');
// // // const fs = require('fs');
// // // const { parse } = require('json2csv');

// // // // Função principal
// // // (async () => {
// // //   const browser = await puppeteer.launch({
// // //     headless: false,
// // //     defaultViewport: false,
// // //     userDataDir: "./tmp"
// // //   });

// // //   // Extrair dados para cada categoria
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats', 'standard');
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/shooting/Primeira-Liga-Stats', 'shooting');
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/passing/Primeira-Liga-Stats', 'passing');
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/gca/Primeira-Liga-Stats', 'gca');
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/defense/Primeira-Liga-Stats', 'defense');
// // //   await extractCategory(browser, 'https://fbref.com/en/comps/32/possession/Primeira-Liga-Stats', 'possession');

// // //   // Fecha o navegador após todas as operações serem concluídas
// // //   await browser.close();
// // // })();

// // // // Função para extrair dados de uma categoria e salvar em JSON e CSV
// // // const extractCategory = async (browser, url, category) => {
// // //   const page = await browser.newPage();
// // //   await page.goto(url);
// // //   await clickButton(page, `#stats_${category}_per_match_toggle`);
// // //   const columnNames = await extractColumnNames(page, `#stats_${category}`);
// // //   const data = await extractData(page, `#stats_${category}`, columnNames);
// // //   fs.writeFileSync(`${category}.json`, JSON.stringify(data, null, 2));
// // //   const csv = parse(data);
// // //   fs.writeFileSync(`${category}.csv`, csv);
// // //   console.log(`Dados da categoria ${category} extraídos e salvos.`);
// // // };

// // // // Função para clicar no botão de uma categoria
// // // const clickButton = async (page, selector) => {
// // //   await page.waitForSelector(selector);
// // //   await page.evaluate((selector) => {
// // //     document.querySelector(selector).click();
// // //   }, selector);
// // //   console.log('Botão clicado com sucesso!');
// // // };

// // // // Função para extrair os nomes das colunas de uma categoria
// // // const extractColumnNames = async (page, selector) => {
// // //   return await page.evaluate((selector) => {
// // //     const columnElements = document.querySelectorAll(`${selector} th:not(.over_header)`);
// // //     const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
// // //     return columnNames;
// // //   }, selector);
// // // };

// // // // Função para extrair dados de uma categoria
// // // const extractData = async (page, selector, columnNames) => {
// // //   return await page.evaluate((selector) => {
// // //     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
// // //     const rowData = [];

// // //     tableRows.forEach(row => {
// // //       const cells = row.querySelectorAll('td');
// // //       const rowDataItem = {};

// // //       // Extrair o valor de Rk
// // //       rowDataItem['Rk'] = row.getAttribute('data-row');

// // //       // Extrair o código do jogador
// // //       rowDataItem['PlayerCode'] = row.getAttribute('data-append-csv');

// // //       // Extrair os dados das colunas
// // //       cells.forEach((cell, index) => {
// // //         const columnStat = cell.getAttribute('data-stat');
// // //         rowDataItem[columnStat] = cell.innerText.trim();
// // //       });

// // //       // Adicionar o objeto de dados da linha ao array de dados
// // //       rowData.push(rowDataItem);
// // //     });

// // //     return rowData;
// // //   }, selector);
// // // };
