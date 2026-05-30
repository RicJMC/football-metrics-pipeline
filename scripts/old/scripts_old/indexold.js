const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData() {
    const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Agora você pode usar seletores CSS para selecionar os elementos HTML que contêm os dados que você deseja coletar
        $('tr').each((index, element) => {
            // Aqui você pode extrair os dados relevantes de cada linha (elemento HTML) e fazer o que desejar com eles
            console.log($(element).text());
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

fetchData();



// // Função para extrair dados da tabela
// const extractData = async (page) => {
//   return await page.evaluate(() => {
//       const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//       const rowData = [];

//       // Extrair automaticamente os nomes das colunas
//       const columnElements = document.querySelectorAll('#stats_standard th:not(.over_header)');
//       const columnNames = Array.from(columnElements).map(th => th.getAttribute('data-stat'));

//       tableRows.forEach(row => {
//           const cells = row.querySelectorAll('td');
//           const rowDataItem = {};

//           // Extrair os dados das colunas
//           cells.forEach((cell, index) => {
//               rowDataItem[columnNames[index]] = cell.innerText.trim();
//           });

//           // Adicionar o objeto de dados da linha ao array de dados
//           rowData.push(rowDataItem);
//       });

//       return rowData;
//   });
// };






// const extractData = async (page) => {
//   return await page.evaluate(() => {
//       const tableRows = document.querySelectorAll('#stats_standard tbody tr[data-row]');
//       const rowData = [];

//       // Extrair automaticamente os nomes das colunas
//       const columnNames = Array.from(document.querySelectorAll('#stats_standard th:not(.over_header)')).map(th => th.innerText.trim());

//       tableRows.forEach(row => {
//           const cells = row.querySelectorAll('td');
//           const rowDataItem = {};

//           // Extrair os dados da linha
//           cells.forEach((cell, index) => {
//               rowDataItem[columnNames[index]] = cell.innerText.trim();
//           });

//           // Adicionar o objeto de dados da linha ao array de dados
//           rowData.push(rowDataItem);
//       });

//       return rowData;
//   });
// };




// const extractData = async (page, columnNames) => {
//   return await page.evaluate((columnNames) => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};

//       // Verifica se há células presentes na linha antes de tentar acessá-las
//       if (cells.length > 0) {
//         // Ajuste para considerar que o primeiro elemento do row é o nome do jogador
//         rowDataItem[columnNames[1]] = cells[0].innerText.trim(); // Player

//         // Começa a extrair os dados a partir do segundo elemento
//         for (let i = 1; i < cells.length; i++) {
//           rowDataItem[columnNames[i + 1]] = cells[i].innerText.trim();
//         }

//         // Adiciona o objeto de dados da linha ao array de dados
//         rowData.push(rowDataItem);
//       }
//     });

//     return rowData;
//   }, columnNames);
// };

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Executa a função para clicar no botão e exibir os dados desejados
//   await clickButton(page);

//   // Executa a função para extrair e gravar os dados da tabela
//   await extractAndSaveData(page);

//   // Fecha o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair e gravar os dados da tabela
// const extractAndSaveData = async (page) => {
//   // Extrair nomes das colunas
//   const columnNames = await extractColumnNames(page);

//   // Extrai dados da tabela
//   const data = await extractData(page, columnNames);

//   // Visualiza os dados no console
//   console.log(data);

//   // Grava os dados em JSON
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
//   // Converte os dados para CSV e grava em arquivo
//   const csv = parse(data);
//   fs.writeFileSync('data.csv', csv);
// };

// // Função para extrair os nomes das colunas
// const extractColumnNames = async (page) => {
//   return await page.evaluate(() => {
//     const columnElements = document.querySelectorAll('#stats_standard th:not(.over_header)');
//     const columnNames = Array.from(columnElements).map(th => th.innerText.trim());
//     return columnNames;
//   });
// };

// // Função para extrair dados da tabela
// const extractData = async (page, columnNames) => {
//   return await page.evaluate((columnNames) => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr:not(.over_header)');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};
//       cells.forEach((cell, index) => {
//         // Verifica se a coluna não é do cabeçalho over_header
//         if (!cell.closest('tr').classList.contains('over_header')) {
//           // Extrai o texto de cada célula e adiciona ao objeto de dados da linha
//           rowDataItem[columnNames[index]] = cell.innerText.trim();
//         }
//       });
//       // Adiciona o objeto de dados da linha ao array de dados
//       rowData.push(rowDataItem);
//     });

//     return rowData;
//   }, columnNames);
// };














// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Mapeamento dos nomes das colunas da tabela
// const columnNames = [
//   "Rk", "Player", "Nation", "Pos", "Squad", "Age", "Born", "MP", "Starts", "Min",
//   "90s", "Gls", "Ast", "G+A", "G-PK", "PK", "PKatt", "CrdY", "CrdR", "xG", "npxG",
//   "xAG", "npxG+xAG", "PrgC", "PrgP", "PrgR", "Gls", "Ast", "G+A", "G-PK", "G+A-PK",
//   "xG", "xAG", "xG+xAG", "npxG", "npxG+xAG", "Matches"
// ];

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Executa a função para clicar no botão e exibir os dados desejados
//   await clickButton(page);

//   // Executa a função para extrair e gravar os dados da tabela
//   await extractAndSaveData(page, columnNames);

//   // Fecha o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair e gravar os dados da tabela
// const extractAndSaveData = async (page, columnNames) => {
//   // Extrai dados da tabela
//   const data = await extractData(page, columnNames);

//   // Visualiza os dados no console
//   console.log(data);

//   // Grava os dados em JSON
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
//   // Converte os dados para CSV e grava em arquivo
//   const csv = parse(data);
//   fs.writeFileSync('data.csv', csv);
// };

// // Função para extrair dados da tabela
// const extractData = async (page, columnNames) => {
//   return await page.evaluate((columnNames) => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr:not(.over_header)');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};
//       cells.forEach((cell, index) => {
//         // Verifica se a coluna não é do cabeçalho over_header
//         if (!cell.closest('tr').classList.contains('over_header')) {
//           // Extrai o texto de cada célula e adiciona ao objeto de dados da linha
//           rowDataItem[columnNames[index]] = cell.innerText.trim();
//         }
//       });
//       // Adiciona o objeto de dados da linha ao array de dados
//       rowData.push(rowDataItem);
//     });

//     return rowData;
//   }, columnNames);
// };










// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Executa a função para clicar no botão e exibir os dados desejados
//   await clickButton(page);

//   // Executa a função para extrair e gravar os dados da tabela
//   await extractAndSaveData(page);

//   // Fecha o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair e gravar os dados da tabela
// const extractAndSaveData = async (page) => {
//   // Extrai dados da tabela
//   const data = await extractData(page);

//   // Visualiza os dados no console
//   console.log(data);

//   // Grava os dados em JSON
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
//   // Converte os dados para CSV e grava em arquivo
//   const csv = parse(data);
//   fs.writeFileSync('data.csv', csv);
// };

// // Função para extrair dados da tabela
// const extractData = async (page) => {
//   return await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr:not(.over_header)');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};
//       cells.forEach((cell, index) => {
//         // Extrai o texto de cada célula e adiciona ao objeto de dados da linha
//         rowDataItem[`column_${index}`] = cell.innerText.trim();
//       });
//       // Adiciona o objeto de dados da linha ao array de dados
//       rowData.push(rowDataItem);
//     });

//     return rowData;
//   });
// };



// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { parse } = require('json2csv');

// // Função principal
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Executa a função para clicar no botão e exibir os dados desejados
//   await clickButton(page);

//   // Executa a função para extrair e gravar os dados da tabela
//   await extractAndSaveData(page);

//   // Fecha o navegador após todas as operações serem concluídas
//   await browser.close();
// })();

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair e gravar os dados da tabela
// const extractAndSaveData = async (page) => {
//   // Extrai dados da tabela
//   const data = await extractData(page);

//   // Visualiza os dados no console
//   console.log(data);

//   // Grava os dados em JSON
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
//   // Converte os dados para CSV e grava em arquivo
//   const csv = parse(data);
//   fs.writeFileSync('data.csv', csv);
// };

// // Função para extrair dados da tabela
// const extractData = async (page) => {
//   return await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const cells = row.querySelectorAll('td');
//       const rowDataItem = {};
//       cells.forEach((cell, index) => {
//         // Extrai o texto de cada célula e adiciona ao objeto de dados da linha
//         rowDataItem[`column_${index}`] = cell.innerText.trim();
//       });
//       // Adiciona o objeto de dados da linha ao array de dados
//       rowData.push(rowDataItem);
//     });

//     return rowData;
//   });
// };




// const axios = require('axios');
// const cheerio = require('cheerio');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const $ = cheerio.load(response.data);
        
//         // Aqui você pode usar seletores CSS para selecionar os elementos HTML que contêm os dados que você deseja coletar
//         $('tr').each((index, element) => {
//             // Aqui você pode extrair os dados relevantes de cada linha (elemento HTML) e fazer o que desejar com eles
//             console.log($(element).text());
//         });
//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();


// const cheerio = require("cheerio");
// const ObjectsToCsv = require("objects-to-csv");
// const axios = require("axios");

// const premierLeagueTable = [];

// (async function () {
//    try {
//        const scraperApiKey = "REDACTED_LEGACY_EXAMPLE_KEY";
//        const scraperApiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=`;

//        const response = await axios.get(`${scraperApiUrl}https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats`);

//        console.log('Loading data from fbref');
//        console.log(response.status);

//        const html = response.data;
//        const $ = cheerio.load(html);
//        const allRows = $("table#stats_standard tbody tr");

//        console.log('Going through rows');

//        allRows.each((index, element) => {
//            const tds = $(element).find('td');
//            const rowData = {
//                rank: $(tds[0]).text().trim(),
//                player: $(tds[1]).text().trim(),
//                nationality: $(tds[2]).text().trim(),
//                position: $(tds[3]).text().trim(),
//                squad: $(tds[4]).text().trim(),
//                age: $(tds[5]).text().trim(),
//                birth_year: $(tds[6]).text().trim(),
//                games: $(tds[7]).text().trim(),
//                games_starts: $(tds[8]).text().trim(),
//                minutes: $(tds[9]).text().trim(),
//                minutes_90s: $(tds[10]).text().trim(),
//                goals: $(tds[11]).text().trim(),
//                assists: $(tds[12]).text().trim(),
//                goals_assists: $(tds[13]).text().trim(),
//                goals_pens: $(tds[14]).text().trim(),
//                pens_made: $(tds[15]).text().trim(),
//                pens_att: $(tds[16]).text().trim(),
//                cards_yellow: $(tds[17]).text().trim(),
//                cards_red: $(tds[18]).text().trim(),
//                xg: $(tds[19]).text().trim(),
//                npxg: $(tds[20]).text().trim(),
//                xg_assist: $(tds[21]).text().trim(),
//                npxg_xg_assist: $(tds[22]).text().trim(),
//                progressive_carries: $(tds[23]).text().trim(),
//                progressive_passes: $(tds[24]).text().trim(),
//                progressive_passes_received: $(tds[25]).text().trim(),
//                goals_per90: $(tds[26]).text().trim(),
//                assists_per90: $(tds[27]).text().trim(),
//                goals_assists_per90: $(tds[28]).text().trim(),
//                goals_pens_per90: $(tds[29]).text().trim(),
//                goals_assists_pens_per90: $(tds[30]).text().trim(),
//                xg_per90: $(tds[31]).text().trim(),
//                xg_assist_per90: $(tds[32]).text().trim(),
//                xg_xg_assist_per90: $(tds[33]).text().trim(),
//                npxg_per90: $(tds[34]).text().trim(),
//                npxg_xg_assist_per90: $(tds[35]).text().trim(),
//                matches: $(tds[36]).text().trim()
//            };
//            premierLeagueTable.push(rowData);
//        });

//        console.log('Saving data to CSV');

//        const csv = new ObjectsToCsv(premierLeagueTable);
//        await csv.toDisk('./fbrefData.csv');

//        console.log('Saved to csv');
//    } catch (error) {
//        console.error(error);
//    }
// })();




// // const cheerio = require("cheerio");
// // const ObjectsToCsv = require("objects-to-csv");
// // const axios = require("axios");

// // const premierLeagueTable = [];

// // (async function () {
// //    try {
// //        const scraperApiKey = "REDACTED_LEGACY_EXAMPLE_KEY";
// //        const scraperApiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=`;

// //        const response = await axios.get(`${scraperApiUrl}https://www.bbc.com/sport/football/tables`);

// //        console.log('Loading tables');
// //        console.log(response.status);

// //        const html = response.data;
// //        const $ = cheerio.load(html);
// //        const allRows = $("table.gs-o-table > tbody.gel-long-primer > tr");

// //        console.log('Going through rows');

// //        allRows.each((index, element) => {
// //            const tds = $(element).find('td');
// //            const team = $(tds[2]).text();
// //            const played = $(tds[3]).text();
// //            const won = $(tds[4]).text();
// //            const drawn = $(tds[5]).text();
// //            const lost = $(tds[6]).text();
// //            const gf = $(tds[7]).text();
// //            const against = $(tds[8]).text();
// //            const gd = $(tds[9]).text();
// //            const points = $(tds[10]).text();

// //            premierLeagueTable.push({
// //                'Team': team,
// //                'Played': played,
// //                'Won': won,
// //                'Drawn': drawn,
// //                'Lost': lost,
// //                'Goals For': gf,
// //                'Goals Against': against,
// //                'Goals Difference': gd,
// //                'Points': points,
// //            });
// //        });

// //        console.log('Saving data to CSV');

// //        const csv = new ObjectsToCsv(premierLeagueTable);
// //        await csv.toDisk('./footballData.csv');

// //        console.log('Saved to csv');
// //    } catch (error) {
// //        console.error(error);
// //    }
// // })();


// // // const axios = require('axios');
// // // const cheerio = require('cheerio');

// // // const fetchData = async () => {
// // //   try {
// // //     const response = await axios.get('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');
// // //     const html = response.data;
// // //     const $ = cheerio.load(html);
// // //     const data = [];

// // //     $('table#stats_standard tbody tr').each((index, el) => {
// // //       const tds = $(el).find('td');
// // //       const rowData = {
// // //         rank: $(tds[0]).text().trim(),
// // //         player: $(tds[1]).text().trim(),
// // //         nationality: $(tds[2]).text().trim(),
// // //         position: $(tds[3]).text().trim(),
// // //         squad: $(tds[4]).text().trim(),
// // //         age: $(tds[5]).text().trim(),
// // //         birth_year: $(tds[6]).text().trim(),
// // //         games: $(tds[7]).text().trim(),
// // //         games_starts: $(tds[8]).text().trim(),
// // //         minutes: $(tds[9]).text().trim(),
// // //         minutes_90s: $(tds[10]).text().trim(),
// // //         goals: $(tds[11]).text().trim(),
// // //         assists: $(tds[12]).text().trim(),
// // //         goals_assists: $(tds[13]).text().trim(),
// // //         goals_pens: $(tds[14]).text().trim(),
// // //         pens_made: $(tds[15]).text().trim(),
// // //         pens_att: $(tds[16]).text().trim(),
// // //         cards_yellow: $(tds[17]).text().trim(),
// // //         cards_red: $(tds[18]).text().trim(),
// // //         xg: $(tds[19]).text().trim(),
// // //         npxg: $(tds[20]).text().trim(),
// // //         xg_assist: $(tds[21]).text().trim(),
// // //         npxg_xg_assist: $(tds[22]).text().trim(),
// // //         progressive_carries: $(tds[23]).text().trim(),
// // //         progressive_passes: $(tds[24]).text().trim(),
// // //         progressive_passes_received: $(tds[25]).text().trim(),
// // //         goals_per90: $(tds[26]).text().trim(),
// // //         assists_per90: $(tds[27]).text().trim(),
// // //         goals_assists_per90: $(tds[28]).text().trim(),
// // //         goals_pens_per90: $(tds[29]).text().trim(),
// // //         goals_assists_pens_per90: $(tds[30]).text().trim(),
// // //         xg_per90: $(tds[31]).text().trim(),
// // //         xg_assist_per90: $(tds[32]).text().trim(),
// // //         xg_xg_assist_per90: $(tds[33]).text().trim(),
// // //         npxg_per90: $(tds[34]).text().trim(),
// // //         npxg_xg_assist_per90: $(tds[35]).text().trim(),
// // //         matches: $(tds[36]).text().trim()
// // //       };
// // //       data.push(rowData);
// // //     });

// // //     console.log(data);
// // //     return data;
// // //   } catch (err) {
// // //     console.error(err);
// // //   }
// // // }

// // // fetchData().then(data => console.log(data));
