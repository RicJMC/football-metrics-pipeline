const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();

  await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');
  await page.waitForSelector('#stats_standard_per_match_toggle');
  await page.evaluate(() => {
    document.querySelector('#stats_standard_per_match_toggle').click();
  });

  console.log('Botão clicado com sucesso!');


  const data = await page.evaluate(() => {
    const tableRows = document.querySelectorAll('#stats_standard tbody tr');
    const rowData = [];

    tableRows.forEach(row => {
      const columns = row.querySelectorAll('td');
      const rowDataItem = [];

      columns.forEach((column, index) => {
        let value = column.textContent.trim();
        if (index === 3) {
          value = value.replace(/,/g, ' '); // Substituir vírgulas por espaços
        }
        rowDataItem.push(value);
      });
      
      rowData.push(rowDataItem);
    });
    
    return rowData;
  });

  // Salvar em CSV
  const csvHeader = "Player,Nation,Pos,Squad,Age,Born,MP,Starts,Min,90s,Gls,Ast,G+A,G-PK,PK,CrdY,CrdR,xG,npxG,xAG,npxG+xAG,PrgC,PrgP,PrgR,Goals/90,Assists/90,Goals + Assists/90,Non-Penalty Goals/90,Non-Penalty Goals + Assists/90,xG/90,xAG/90,xG + xAG/90,npxG/90,npxG + xAG,Matches\n";
  const csvData = data.map(row => row.join(',')).join('\n');
  const csvContent = csvHeader + csvData;
  fs.writeFileSync('data.csv', csvContent);
  console.log('Dados salvos em data.csv');

  // Salvar em JSON
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2)); // Formatar para facilitar a leitura
  console.log('Dados salvos em data.json');

  await browser.close();
})()
//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];

//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];

//       columns.forEach((column, index) => {
//         // Tratar a coluna de posição para substituir as vírgulas por espaços ou pontos
//         let value = column.textContent.trim();
//         if (index === 3) {
//           value = value.replace(/,/g, ' '); // Substituir vírgulas por espaços
//         }
//         rowDataItem.push(value);
//       });
      
//       rowData.push(rowDataItem);
//     });
    
//     return rowData;
//   });

//   // Salvar em CSV
//   const csvData = data.map(row => row.join(',')).join('\n');
//   fs.writeFileSync('data.csv', csvData);
//   console.log('Dados salvos em data.csv');

//   // Salvar em JSON
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 2)); // Formatar para facilitar a leitura
//   console.log('Dados salvos em data.json');

//   await browser.close();
// })();

//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];

//     // Extrair cabeçalhos automaticamente
//     const headers = Array.from(document.querySelectorAll('#stats_standard th')).map(th => th.textContent.trim());

//     // Adicionar cabeçalhos como a primeira linha de rowData
//     rowData.push(headers.join(','));

//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];

//       columns.forEach((column, index) => {
//         // Tratar a coluna de posição para substituir as vírgulas por espaços ou pontos
//         if (index === 3) {
//           const pos = column.textContent.trim().replace(/,/g, ' '); // Substituir vírgulas por espaços
//           rowDataItem.push(pos);
//         } else {
//           rowDataItem.push(column.textContent.trim());
//         }
//       });
      
//       rowData.push(rowDataItem.join(','));
//     });
    
//     return rowData.join('\n');
//   });

//   fs.writeFileSync('data.csv', data);
//   console.log('Dados salvos em data.csv');

//   await browser.close();
// })();

  
//   const data = await page.evaluate(() => {
//     const table = document.querySelector('#stats_standard');
//     const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
//     const rows = Array.from(table.querySelectorAll('tbody tr'));
//     const rowData = [];
    
//     rows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];

//       columns.forEach((column, index) => {
//         if (index === 2) {
//           // Combine multiple positions into one column
//           const pos = row.querySelector('[data-stat="position"]');
//           if (pos) {
//             rowDataItem.push(pos.textContent.trim());
//           }
//         } else {
//           rowDataItem.push(column.textContent.trim());
//         }
//       });
      
//       rowData.push(rowDataItem.join(','));
//     });
    
//     return headers.join(',') + '\n' + rowData.join('\n');
//   });

//   fs.writeFileSync('data.csv', data);
//   console.log('Dados salvos em data.csv');

//   await browser.close();
// })();



//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];
//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];
//       columns.forEach(column => {
//         rowDataItem.push(column.textContent.trim());
//       });
//       rowData.push(rowDataItem.join(','));
//     });
//     return rowData.join('\n');
//   });

//   fs.writeFileSync('data.csv', data);
//   console.log('Dados salvos em data.csv');

//   await browser.close();
// })();

//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('.stats_table tbody tr');
//     const rowData = [];
//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];
//       columns.forEach(column => {
//         rowDataItem.push(column.textContent.trim());
//       });
//       rowData.push(rowDataItem.join(','));
//     });
//     return rowData.join('\n');
//   });

//   fs.writeFileSync('data.csv', data);
//   console.log('Dados salvos em data.csv');

//   await browser.close();
// })();

//   await page.waitForSelector('tr[data-row]');
//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('tr[data-row]'));
//     return rows.map(row => {
//       const columns = Array.from(row.querySelectorAll('td'));
//       return columns.map(column => column.textContent.trim());
//     });
//   });

//   const csvData = data.map(row => row.join(','));
//   csvData.unshift('player,nationality,position,team,age,birth_year,games,games_starts,minutes,minutes_90s,goals,assists,goals_assists,goals_pens,pens_made,pens_att,cards_yellow,cards_red,xg,npxg,xg_assist,npxg_xg_assist,progressive_carries,progressive_passes,progressive_passes_received,goals_per90,assists_per90,goals_assists_per90,goals_pens_per90,goals_assists_pens_per90,xg_per90,xg_assist_per90,xg_xg_assist_per90,npxg_per90,npxg_xg_assist_per90,matches');

//   fs.writeFileSync('data.csv', csvData.join('\n'));
//   console.log('Dados salvos em data.csv');

//   await browser.close();
// })();













// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const parse = require('csv-parse/lib/sync');

// (async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   // Intercepta as mensagens de console e exibe-as no console do Node.js
//   // page.on('console', msg => {
//   //   console.log('Mensagem do navegador:', msg.text());
//   // });

//   // Navigate the page to a URL
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Espera até que o botão com o ID "stats_standard_per_match_toggle" seja carregado
//   await page.waitForSelector('#stats_standard_per_match_toggle');

//   // Clique no botão usando page.evaluate()
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });

//   // Adiciona um comentário na console após clicar no botão
//   console.log('Botão clicado com sucesso!');

//   // Capture a classe do elemento <li> após o clique
//   const modifiedClass = await page.evaluate(() => {
//     return document.querySelector('li.modified').getAttribute('class');
//   });

//   console.log('Classe do elemento <li> após o clique:', modifiedClass);

//     // Espera até que todos os elementos <tr> com atributo data-row sejam carregados
//     await page.waitForSelector('tr[data-row]');

//     // Coleta os dados de todos os elementos <tr> e os armazena em uma matriz de objetos
//     const data = await page.evaluate(() => {
//       const rows = Array.from(document.querySelectorAll('tr[data-row]'));
//       return rows.map(row => {
//         const columns = Array.from(row.querySelectorAll('td'));
//         return columns.map(column => column.textContent.trim());
//       });
//     });
  
//     // Converte os dados para o formato CSV
//     const csvData = data.map(row => row.join(','));
  
//     // Adiciona os cabeçalhos das colunas ao CSV
//     csvData.unshift('player,nationality,position,team,age,birth_year,games,games_starts,minutes,minutes_90s,goals,assists,goals_assists,goals_pens,pens_made,pens_att,cards_yellow,cards_red,xg,npxg,xg_assist,npxg_xg_assist,progressive_carries,progressive_passes,progressive_passes_received,goals_per90,assists_per90,goals_assists_per90,goals_pens_per90,goals_assists_pens_per90,xg_per90,xg_assist_per90,xg_xg_assist_per90,npxg_per90,npxg_xg_assist_per90,matches');
  
//     // Salva os dados em um arquivo CSV
//     fs.writeFileSync('data.csv', csvData.join('\n'));
  
//     console.log('Dados salvos em data.csv');

//   // Feche o navegador
//   await browser.close();
// })();




// const puppeteer = require('puppeteer');

// (async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();
//   // Intercepta as mensagens de console e exibe-as no console do Node.js
//   // page.on('console', msg => {
//   //   console.log('Mensagem do navegador:', msg.text());
//   // });

//   // Navigate the page to a URL
//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');
//     // Espera até que o botão com a classe "tooltip" seja carregado
//   await page.waitForSelector('#stats_standard_per_match_toggle');

//   // Clique no botão usando page.evaluate()
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   // Clique no botão
//   await page.click('#stats_standard_per_match_toggle');

//   // Adiciona um comentário na console após clicar no botão
//   console.log('Botão clicado com sucess!');

//   // Capture a classe do elemento <li> após o clique
//   const modifiedClass = await page.evaluate(() => {
//     return document.querySelector('li.modified').getAttribute('class');
//   });

//   console.log('Classe do elemento <li> após o clique:', modifiedClass);

  

//   // // Set screen size
//   // await page.setViewport({width: 1080, height: 1024});

//   // // Type into search box
//   // await page.type('.devsite-search-field', 'automate beyond recorder');

//   // // Wait and click on first result
//   // const searchResultSelector = '.devsite-result-item-link';
//   // await page.waitForSelector(searchResultSelector);
//   // await page.click(searchResultSelector);

//   // Locate the full title with a unique string
//   // const textSelector = await page.waitForSelector(
//   //   'text/Customize and automate'
//   // );
//   // const fullTitle = await textSelector?.evaluate(el => el.textContent);

//   // // Print the full title
//   // console.log('The title of this blog post is "%s".', fullTitle);

//   // await browser.close();
// })();
