// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: './tmp',
//   });

//   const seasons = [
//     '2018-2019',
//     '2019-2020',
//     '2020-2021',
//     '2021-2022',
//     '2022-2023',
//     '2023-2024'
//   ];

//   const league = 'Primeira-Liga'; // Liga fixa para todos os anos

//   const categories = [
//     'standard',
//     'shooting',
//     'passing',
//     'gca',
//     'defense',
//     'possession',
//     'misc'
//   ];

//   // Array para armazenar todas as promessas de extração de categoria
//   const extractionPromises = [];

//   // Iterar sobre cada temporada e categoria
//   for (const season of seasons) {
//     for (const category of categories) {
//       let url;
//       if (category === 'standard') {
//         url = `https://fbref.com/en/comps/32/${season}/stats/${season}-${league}-Stats`;
//       } else {
//         url = `https://fbref.com/en/comps/32/${season}/${category}/${season}-${league}-Stats`;
//       }
//       const extractionPromise = extractCategory(browser, url, category, season, league);
//       extractionPromises.push(extractionPromise);
//     }
//   }

//   // Esperar que todas as promessas de extração de categoria sejam resolvidas
//   await Promise.all(extractionPromises);

//   console.log('Extração de dados concluída para todas as categorias e temporadas.');

//   // Fechar o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category, season, league) => {
//   console.log(`Extraindo dados da categoria ${category} da ${league} na temporada ${season}...`);
//   const page = await browser.newPage();
//   await page.goto(url, { timeout: 180000 });

//   try {
//     // Esperar até que o botão de alternância "standard" esteja disponível
//     await page.waitForSelector(`#stats_standard_per_match_toggle`, { timeout: 5000 });
//     console.log('Botão "standard" encontrado.');

//     // Clicar no botão "standard"
//     await clickButton(page, `#stats_standard_per_match_toggle`);
//     console.log('Botão "standard" clicado.');

//     // Esperar até que a categoria desejada esteja disponível
//     await page.waitForSelector(`#stats_${category}`, { timeout: 5000 });
//     console.log(`Categoria ${category} encontrada.`);

//     // Extrair os nomes das colunas
//     const columnNames = await extractColumnNames(page, `#stats_${category}`);

//     // Extrair os dados
//     const data = await extractData(page, `#stats_${category}`, columnNames);

//     // Salvar os dados
//     await saveData(data, category, season, league);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} extraídos e salvos.`);

//   } catch (error) {
//     console.error(`Erro ao extrair dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   } finally {
//     // Fechar a página
//     await page.close();
//   }
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   console.log(`Clicando no botão ${selector}...`);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(
//       `${selector} th:not(.over_header)`,
//     );
//     const columnNames = Array.from(columnElements).map((th) =>
//       th.innerText.trim(),
//     );
//     console.log(`Nomes das colunas extraídos: ${columnNames}`);
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   console.log(`Extraindo dados para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach((row) => {
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

//     console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category, season, league) => {
//   console.log(`Salvando dados da categoria ${category} da ${league} na temporada ${season}...`);

//   // Define o caminho para o diretório de destino
//   const directoryPath = `./data/${season}/32/${season}-${league}-Stats/${category}/`;

//   try {
//     // Cria os diretórios de destino se eles não existirem
//     fs.mkdirSync(directoryPath, { recursive: true });

//     // Salva os arquivos JSON e CSV
//     fs.writeFileSync(
//       `${directoryPath}${season}-${league}-${category}.json`,
//       JSON.stringify(data, null, 2),
//     );
//     const csv = parse(data);
//     fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} salvos.`);
//   } catch (error) {
//     console.error(`Erro ao salvar dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   }
// };






















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
    '2018-2019',
    '2019-2020',
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024'
  ];

  const league = 'Primeira-Liga'; // Liga fixa para todos os anos

  const categories = [
    'standard',
    'shooting',
    'passing',
    'gca',
    'defense',
    'possession',
    'misc'
  ];

  // Array para armazenar todas as promessas de extração de categoria
  const extractionPromises = [];

   // Iterar sobre cada temporada e categoria
  for (const season of seasons) {
    for (const category of categories) {
      let url;
      if (category === 'standard') {
        url = `https://fbref.com/en/comps/32/${season}/stats/${season}-${league}-Stats`;
      } else {
        url = `https://fbref.com/en/comps/32/${season}/${category}/${season}-${league}-Stats`;
      }
      const extractionPromise = extractCategory(browser, url, category, season, league);
      extractionPromises.push(extractionPromise);
    }
  }

  // Esperar que todas as promessas de extração de categoria sejam resolvidas

  // Esperar que todas as promessas de extração de categoria sejam resolvidas
  await Promise.all(extractionPromises);

  console.log('Extração de dados concluída para todas as categorias e temporadas.');

  // Fechar o navegador após todas as operações serem concluídas
  await browser.close();
})();

// Função para extrair dados de uma categoria e salvar em JSON e CSV
const extractCategory = async (browser, url, category, season, league) => {
  console.log(`Extraindo dados da categoria ${category} da ${league} na temporada ${season}...`);
  const page = await browser.newPage();
  await page.goto(url, { timeout: 180000 });
  await page.waitForSelector(`#stats_${category}_per_match_toggle`);
  await clickButton(page, `#stats_${category}_per_match_toggle`);
  const columnNames = await extractColumnNames(page, `#stats_${category}`);
  const data = await extractData(page, `#stats_${category}`, columnNames);
  await saveData(data, category, season, league);
  console.log(`Dados da categoria ${category} da ${league} na temporada ${season} extraídos e salvos.`);
  await page.close();
};

// Função para clicar no botão de uma categoria
const clickButton = async (page, selector) => {
  console.log(`Clicando no botão ${selector}...`);
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
  console.log(`Botão ${selector} clicado com sucesso!`);
};

// Função para extrair os nomes das colunas de uma categoria
const extractColumnNames = async (page, selector) => {
  console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
  return await page.evaluate((selector) => {
    const columnElements = document.querySelectorAll(
      `${selector} th:not(.over_header)`,
    );
    const columnNames = Array.from(columnElements).map((th) =>
      th.innerText.trim(),
    );
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

    console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
    return rowData;
  }, selector);
};

// Função para salvar dados em JSON e CSV
const saveData = async (data, category, season, league) => {
  console.log(`Salvando dados da categoria ${category} da ${league} na temporada ${season}...`);
  
  // Define o caminho para o diretório de destino
  const directoryPath = `./data/${season}/32/${season}-${league}-Stats/${category}/`;

  try {
    // Cria os diretórios de destino se eles não existirem
    fs.mkdirSync(directoryPath, { recursive: true });

    // Salva os arquivos JSON e CSV
    fs.writeFileSync(
      `${directoryPath}${season}-${league}-${category}.json`,
      JSON.stringify(data, null, 2),
    );
    const csv = parse(data);
    fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
    console.log(`Dados da categoria ${category} da ${league} na temporada ${season} salvos.`);
  } catch (error) {
    console.error(`Erro ao salvar dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
  }
};


















// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: './tmp',
//   });

//   const seasons = [
//     '2018-2019',
//     '2019-2020',
//     '2020-2021',
//     '2021-2022',
//     '2022-2023',
//     '2023-2024'
//   ];

//   const league = 'Primeira-Liga'; // Liga fixa para todos os anos

//   const categories = [
//     'standard',
//     'shooting',
//     'passing',
//     'gca',
//     'defense',
//     'possession',
//     'misc'
//   ];

//   // Array para armazenar todas as promessas de extração de categoria
//   const extractionPromises = [];

//   // Iterar sobre cada temporada e categoria
//   for (const season of seasons) {
//     for (const category of categories) {
//       const url = `https://fbref.com/en/comps/32/${season}/stats/${season}-${league}-${category}-Stats`;
//       const extractionPromise = extractCategory(browser, url, category, season, league);
//       extractionPromises.push(extractionPromise);
//     }
//   }

//   // Esperar que todas as promessas de extração de categoria sejam resolvidas
//   await Promise.all(extractionPromises);

//   console.log('Extração de dados concluída para todas as categorias e temporadas.');

//   // Fechar o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category, season, league) => {
//   console.log(`Extraindo dados da categoria ${category} da ${league} na temporada ${season}...`);
//   const page = await browser.newPage();
//   await page.goto(url, { timeout: 900000 });
  
//   try {
//     // Aguardar que o seletor específico esteja presente antes de prosseguir
//     await page.waitForSelector(`#stats_${category}_per_match_toggle`, { timeout: 900000 });
//     await clickButton(page, `#stats_${category}_per_match_toggle`);

//     // Aguardar um elemento diferente para garantir que a página esteja carregada
//     await page.waitForSelector(`#elemento_de_controle_de_carregamento`, { timeout: 900000 });
    
//     const columnNames = await extractColumnNames(page, `#stats_${category}`);
//     const data = await extractData(page, `#stats_${category}`, columnNames);
//     await saveData(data, category, season, league);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} extraídos e salvos.`);
//   } catch (error) {
//     console.error(`Erro ao extrair dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   } finally {
//     await page.close();
//   }
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   console.log(`Clicando no botão ${selector}...`);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
//   console.log(`Botão ${selector} clicado com sucesso!`);
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(
//       `${selector} th:not(.over_header)`,
//     );
//     const columnNames = Array.from(columnElements).map((th) =>
//       th.innerText.trim(),
//     );
//     console.log(`Nomes das colunas extraídos: ${columnNames}`);
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   console.log(`Extraindo dados para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach((row) => {
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

//     console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category, season, league) => {
//   console.log(`Salvando dados da categoria ${category} da ${league} na temporada ${season}...`);
  
//   // Define o caminho para o diretório de destino
//   const directoryPath = `./data/${season}/32/${season}-${league}-Stats/${category}/`;

//   try {
//     // Cria os diretórios de destino se eles não existirem
//     fs.mkdirSync(directoryPath, { recursive: true });

//     // Salva os arquivos JSON e CSV
//     fs.writeFileSync(
//       `${directoryPath}${season}-${league}-${category}.json`,
//       JSON.stringify(data, null, 2),
//     );
//     const csv = parse(data);
//     fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} salvos.`);
//   } catch (error) {
//     console.error(`Erro ao salvar dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   }
// };

























// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: './tmp',
//   });

//   const seasons = [
//     '2018-2019',
//     '2019-2020',
//     '2020-2021',
//     '2021-2022',
//     '2022-2023',
//     '2023-2024'
//   ];

//   const league = 'Primeira-Liga'; // Liga fixa para todos os anos

//   const categories = [
//     'standard',
//     'shooting',
//     'passing',
//     'gca',
//     'defense',
//     'possession',
//     'misc'
//   ];

//   // Array para armazenar todas as promessas de extração de categoria
//   const extractionPromises = [];

//   // Iterar sobre cada temporada e categoria
//   for (const season of seasons) {
//     for (const category of categories) {
//       const url = `https://fbref.com/en/comps/32/${season}/${category}/${season}-${league}-Stats`;
//       const extractionPromise = extractCategory(browser, url, category, season, league);
//       extractionPromises.push(extractionPromise);
//     }
//   }

//   // Esperar que todas as promessas de extração de categoria sejam resolvidas
//   await Promise.all(extractionPromises);

//   console.log('Extração de dados concluída para todas as categorias e temporadas.');

//   // Fechar o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category, season, league) => {
//   console.log(`Extraindo dados da categoria ${category} da ${league} na temporada ${season}...`);
//   const page = await browser.newPage();
//   await page.goto(url, { timeout: 180000 });
//   await page.waitForSelector(`#stats_${category}_per_match_toggle`);
//   await clickButton(page, `#stats_${category}_per_match_toggle`);
//   const columnNames = await extractColumnNames(page, `#stats_${category}`);
//   const data = await extractData(page, `#stats_${category}`, columnNames);
//   await saveData(data, category, season, league);
//   console.log(`Dados da categoria ${category} da ${league} na temporada ${season} extraídos e salvos.`);
//   await page.close();
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   console.log(`Clicando no botão ${selector}...`);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
//   console.log(`Botão ${selector} clicado com sucesso!`);
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(
//       `${selector} th:not(.over_header)`,
//     );
//     const columnNames = Array.from(columnElements).map((th) =>
//       th.innerText.trim(),
//     );
//     console.log(`Nomes das colunas extraídos: ${columnNames}`);
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   console.log(`Extraindo dados para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach((row) => {
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

//     console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category, season, league) => {
//   console.log(`Salvando dados da categoria ${category} da ${league} na temporada ${season}...`);
  
//   // Define o caminho para o diretório de destino
//   const directoryPath = `./data/${season}/32/${season}-${league}-Stats/${category}/`;

//   try {
//     // Cria os diretórios de destino se eles não existirem
//     fs.mkdirSync(directoryPath, { recursive: true });

//     // Salva os arquivos JSON e CSV
//     fs.writeFileSync(
//       `${directoryPath}${season}-${league}-${category}.json`,
//       JSON.stringify(data, null, 2),
//     );
//     const csv = parse(data);
//     fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} salvos.`);
//   } catch (error) {
//     console.error(`Erro ao salvar dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   }
// };
















// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: './tmp',
//   });

//   const seasons = [
//     '2018-2019',
//     '2019-2020',
//     '2020-2021',
//     '2021-2022',
//     '2022-2023',
//     '2023-2024' // Temporada mais recente
//   ];

//   const leagues = [
//     'Primeira-Liga'
//     // Adicione mais ligas conforme necessário
//   ];

//   const categories = [
//     'standard',
//     'shooting',
//     'passing',
//     'gca',
//     'defense',
//     'possession',
//     'misc'
//   ];

//   const categoryUrls = seasons.flatMap((season) => {
//     return leagues.flatMap((league) => {
//       return categories.map((category) => {
//         return {
//           url: `https://fbref.com/en/comps/32/${season}/stats/${season}-${league}-Stats`,
//           category,
//           season,
//           league
//         };
//       });
//     });
//   });

//   // Array para armazenar todas as promessas de extração de categoria
//   const extractionPromises = [];

//   // Extrair dados para cada categoria
//   for (const category of categoryUrls) {
//     const extractionPromise = extractCategory(
//       browser,
//       category.url,
//       category.category,
//       category.season,
//       category.league,
//     );
//     extractionPromises.push(extractionPromise);
//   }

//   // Esperar que todas as promessas de extração de categoria sejam resolvidas
//   await Promise.all(extractionPromises);

//   console.log('Extração de dados concluída para todas as categorias.');

//   // Fechar o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category, season, league) => {
//   console.log(`Extraindo dados da categoria ${category} da ${league} na temporada ${season}...`);
//   const page = await browser.newPage();
//   await page.goto(url, { timeout: 180000 }); // Defina um tempo limite de 60 segundos (60000 milissegundos)
//   await page.waitForSelector(`#stats_${category}_per_match_toggle`);
//   await clickButton(page, `#stats_${category}_per_match_toggle`);
//   // await page.waitForTimeout(180000); // Espera 3 segundos para garantir que a página seja carregada adequadamente
//   const columnNames = await extractColumnNames(page, `#stats_${category}`);
//   const data = await extractData(page, `#stats_${category}`, columnNames);
//   await saveData(data, category, season, league); // Passando a temporada e a liga para a função saveData
//   console.log(`Dados da categoria ${category} da ${league} na temporada ${season} extraídos e salvos.`);
//   await page.close(); // Fecha a página após a extração estar completa
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   console.log(`Clicando no botão ${selector}...`);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
//   console.log(`Botão ${selector} clicado com sucesso!`);
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(
//       `${selector} th:not(.over_header)`,
//     );
//     const columnNames = Array.from(columnElements).map((th) =>
//       th.innerText.trim(),
//     );
//     console.log(`Nomes das colunas extraídos: ${columnNames}`);
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   console.log(`Extraindo dados para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach((row) => {
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

//     console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category, season, league) => {
//   console.log(`Salvando dados da categoria ${category} da ${league} na temporada ${season}...`);
  
//   // Define o caminho para o diretório de destino
//   const directoryPath = `./data/${season}/${league}/${category}/`;

//   try {
//     // Cria os diretórios de destino se eles não existirem
//     fs.mkdirSync(directoryPath, { recursive: true });

//     // Salva os arquivos JSON e CSV
//     fs.writeFileSync(
//       `${directoryPath}${season}-${league}-${category}.json`,
//       JSON.stringify(data, null, 2),
//     );
//     const csv = parse(data);
//     fs.writeFileSync(`${directoryPath}${season}-${league}-${category}.csv`, csv);
//     console.log(`Dados da categoria ${category} da ${league} na temporada ${season} salvos.`);
//   } catch (error) {
//     console.error(`Erro ao salvar dados da categoria ${category} da ${league} na temporada ${season}: ${error}`);
//   }
// };




















// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: './tmp',
//   });

//   const seasons = [
//     '2018-2019',
//     '2019-2020',
//     '2020-2021',
//     '2021-2022',
//     '2022-2023',
//     '2023-2024' // Temporada mais recente
//   ];

//   const categoryUrls = seasons.flatMap((season) => {
//     const seasonCategories = [
//       {url: `https://fbref.com/en/comps/32/${season}/stats/${season}-Primeira-Liga-Stats`, category: 'standard'},
//       {url: `https://fbref.com/en/comps/32/${season}/shooting/${season}-Primeira-Liga-Stats`, category: 'shooting'},
//       {url: `https://fbref.com/en/comps/32/${season}/passing/${season}-Primeira-Liga-Stats`, category: 'passing'},
//       {url: `https://fbref.com/en/comps/32/${season}/gca/${season}-Primeira-Liga-Stats`, category: 'gca'},
//       {url: `https://fbref.com/en/comps/32/${season}/defense/${season}-Primeira-Liga-Stats`, category: 'defense'},
//       {url: `https://fbref.com/en/comps/32/${season}/possession/${season}-Primeira-Liga-Stats`, category: 'possession'},
//       {url: `https://fbref.com/en/comps/32/${season}/misc/${season}-Primeira-Liga-Stats`, category: 'misc'}
//     ];
//     return seasonCategories;
//   });

//   // Array para armazenar todas as promessas de extração de categoria
//   const extractionPromises = [];

//   // Extrair dados para cada categoria
//   for (const category of categoryUrls) {
//     const extractionPromise = extractCategory(
//       browser,
//       category.url,
//       category.category,
//       seasons[0], // Usando a primeira temporada da lista
//     );
//     extractionPromises.push(extractionPromise);
//   }

//   // Esperar que todas as promessas de extração de categoria sejam resolvidas
//   await Promise.all(extractionPromises);

//   console.log('Extração de dados concluída para todas as categorias.');

//   // Fechar o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para extrair dados de uma categoria e salvar em JSON e CSV
// const extractCategory = async (browser, url, category, season) => {
//   console.log(`Extraindo dados da categoria ${category}...`);
//   const page = await browser.newPage();
//   await page.goto(url, { timeout: 180000 }); // Defina um tempo limite de 60 segundos (60000 milissegundos)
//   await page.waitForSelector(`#stats_${category}_per_match_toggle`);
//   await clickButton(page, `#stats_${category}_per_match_toggle`);
//   // await page.waitForTimeout(180000); // Espera 3 segundos para garantir que a página seja carregada adequadamente
//   const columnNames = await extractColumnNames(page, `#stats_${category}`);
//   const data = await extractData(page, `#stats_${category}`, columnNames);
//   await saveData(data, category, season); // Passando a temporada para a função saveData
//   console.log(`Dados da categoria ${category} extraídos e salvos.`);
//   await page.close(); // Fecha a página após a extração estar completa
// };

// // Função para clicar no botão de uma categoria
// const clickButton = async (page, selector) => {
//   console.log(`Clicando no botão ${selector}...`);
//   await page.evaluate((selector) => {
//     document.querySelector(selector).click();
//   }, selector);
//   console.log(`Botão ${selector} clicado com sucesso!`);
// };

// // Função para extrair os nomes das colunas de uma categoria
// const extractColumnNames = async (page, selector) => {
//   console.log(`Extraindo nomes das colunas para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const columnElements = document.querySelectorAll(
//       `${selector} th:not(.over_header)`,
//     );
//     const columnNames = Array.from(columnElements).map((th) =>
//       th.innerText.trim(),
//     );
//     console.log(`Nomes das colunas extraídos: ${columnNames}`);
//     return columnNames;
//   }, selector);
// };

// // Função para extrair dados de uma categoria
// const extractData = async (page, selector, columnNames) => {
//   console.log(`Extraindo dados para a categoria ${selector}...`);
//   return await page.evaluate((selector) => {
//     const tableRows = document.querySelectorAll(`${selector} tbody tr`);
//     const rowData = [];

//     tableRows.forEach((row) => {
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

//     console.log(`Dados extraídos: ${JSON.stringify(rowData)}`);
//     return rowData;
//   }, selector);
// };

// // Função para salvar dados em JSON e CSV
// const saveData = async (data, category, season) => {
//   console.log(`Salvando dados para a categoria ${category}...`);
  
//   // Define o caminho para o diretório de destino
//   const directoryPath = `./data/${category}/${season}/`;

//   try {
//     // Cria os diretórios de destino se eles não existirem
//     fs.mkdirSync(directoryPath, { recursive: true });

//     // Salva os arquivos JSON e CSV
//     fs.writeFileSync(
//       `${directoryPath}${season}-Primeira-Liga-Stats.json`,
//       JSON.stringify(data, null, 2),
//     );
//     const csv = parse(data);
//     fs.writeFileSync(`${directoryPath}${season}-Primeira-Liga-Stats.csv`, csv);
//     console.log(`Dados para a categoria ${category} salvos.`);
//   } catch (error) {
//     console.error(`Erro ao salvar dados para a categoria ${category}: ${error}`);
//   }
// };