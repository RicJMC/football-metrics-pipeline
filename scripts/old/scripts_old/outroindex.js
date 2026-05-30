const puppeteer = require('puppeteer');
const fs = require('fs');

// Função para clicar no botão
const clickButton = async (page) => {
  await page.waitForSelector('#stats_standard_per_match_toggle');
  await page.evaluate(() => {
    document.querySelector('#stats_standard_per_match_toggle').click();
  });
  console.log('Botão clicado com sucesso!');
};

// Função para extrair cabeçalhos e dados da tabela
const extractData = async (page) => {
  const data = await page.evaluate(() => {
    const tableRows = document.querySelectorAll('#stats_standard tbody tr');
    const rowData = [];
    console.log(tableRows)

    // Extrair cabeçalhos automaticamente
    const headers = Array.from(document.querySelectorAll('#stats_standard th')).map(th => th.textContent.trim());

    // Adicionar cabeçalhos como a primeira linha de rowData
    rowData.push(headers);

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

  return data;
};

// Função para gravar em CSV
const saveToCSV = (data) => {
  const csvHeader = "Player,Nation,Pos,Squad,Age,Born,MP,Starts,Min,90s,Gls,Ast,G+A,G-PK,PK,CrdY,CrdR,xG,npxG,xAG,npxG+xAG,PrgC,PrgP,PrgR,Goals/90,Assists/90,Goals + Assists/90,Non-Penalty Goals/90,Non-Penalty Goals + Assists/90,xG/90,xAG/90,xG + xAG/90,npxG/90,npxG + xAG,Matches\n";
  const csvData = data.map(row => row.join(',')).join('\n');
  const csvContent = csvHeader + csvData;
  fs.writeFileSync('data.csv', csvContent);
  console.log('Dados salvos em data.csv');
};

// Função para gravar em JSON
const saveToJSON = (data) => {
  // Extrair cabeçalhos
  const headers = data.shift();

  // Converter os dados para objetos JSON
  const jsonData = data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2)); // Formatar para facilitar a leitura
  console.log('Dados salvos em data.json');
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();

  await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

  // Parte 1: Clicar no botão
  await clickButton(page);

  // Parte 2: Extrair cabeçalhos e dados da tabela
  const data = await extractData(page);

  // Parte 3: Gravar em CSV
  saveToCSV(data);

  // Parte 4: Gravar em JSON
  saveToJSON(data);

  await browser.close();
})();









// const puppeteer = require('puppeteer');
// const fs = require('fs');

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair cabeçalhos e dados da tabela
// const extractData = async (page) => {
//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];
//     console.log(tableRows)

//     // Extrair cabeçalhos automaticamente
//     const headers = Array.from(document.querySelectorAll('#stats_standard th')).map(th => th.textContent.trim());

//     // Adicionar cabeçalhos como a primeira linha de rowData
//     rowData.push(headers);

//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];

//       columns.forEach((column, index) => {
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

//   return data;
// };

// // Função para gravar em CSV
// const saveToCSV = (data) => {
//   const csvHeader = "Player,Nation,Pos,Squad,Age,Born,MP,Starts,Min,90s,Gls,Ast,G+A,G-PK,PK,CrdY,CrdR,xG,npxG,xAG,npxG+xAG,PrgC,PrgP,PrgR,Goals/90,Assists/90,Goals + Assists/90,Non-Penalty Goals/90,Non-Penalty Goals + Assists/90,xG/90,xAG/90,xG + xAG/90,npxG/90,npxG + xAG,Matches\n";
//   const csvData = data.map(row => row.join(',')).join('\n');
//   const csvContent = csvHeader + csvData;
//   fs.writeFileSync('data.csv', csvContent);
//   console.log('Dados salvos em data.csv');
// };

// // Função para gravar em JSON
// const saveToJSON = (data) => {
//   // Converter os dados para JSON incluindo os cabeçalhos
//   const jsonData = data.map(row => {
//     const obj = {};
//     data[0].forEach((header, index) => {
//       obj[header] = row[index];
//     });
//     return obj;
//   });

//   fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2)); // Formatar para facilitar a leitura
//   console.log('Dados salvos em data.json');
// };

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();

//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Parte 1: Clicar no botão
//   await clickButton(page);

//   // Parte 2: Extrair cabeçalhos e dados da tabela
//   const data = await extractData(page);

//   // Parte 3: Gravar em CSV
//   saveToCSV(data);

//   // Parte 4: Gravar em JSON
//   saveToJSON(data);

//   await browser.close();
// })();






// const puppeteer = require('puppeteer');
// const fs = require('fs');

// // Função para clicar no botão
// const clickButton = async (page) => {
//   await page.waitForSelector('#stats_standard_per_match_toggle');
//   await page.evaluate(() => {
//     document.querySelector('#stats_standard_per_match_toggle').click();
//   });
//   console.log('Botão clicado com sucesso!');
// };

// // Função para extrair cabeçalhos e dados da tabela
// const extractData = async (page) => {
//   const data = await page.evaluate(() => {
//     const tableRows = document.querySelectorAll('#stats_standard tbody tr');
//     const rowData = [];
//     console.log(tableRows)

//     // Extrair cabeçalhos automaticamente
//     const headers = Array.from(document.querySelectorAll('#stats_standard th')).map(th => th.textContent.trim());

//     // Adicionar cabeçalhos como a primeira linha de rowData
//     rowData.push(headers);

//     tableRows.forEach(row => {
//       const columns = row.querySelectorAll('td');
//       const rowDataItem = [];

//       columns.forEach((column, index) => {
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

//   return data;
// };

// // Função para gravar em CSV
// const saveToCSV = (data) => {
//   const csvHeader = "Player,Nation,Pos,Squad,Age,Born,MP,Starts,Min,90s,Gls,Ast,G+A,G-PK,PK,CrdY,CrdR,xG,npxG,xAG,npxG+xAG,PrgC,PrgP,PrgR,Goals/90,Assists/90,Goals + Assists/90,Non-Penalty Goals/90,Non-Penalty Goals + Assists/90,xG/90,xAG/90,xG + xAG/90,npxG/90,npxG + xAG,Matches\n";
//   const csvData = data.map(row => row.join(',')).join('\n');
//   const csvContent = csvHeader + csvData;
//   fs.writeFileSync('data.csv', csvContent);
//   console.log('Dados salvos em data.csv');
// };

// // Função para gravar em JSON
// const saveToJSON = (data) => {
//   // Converter os dados para JSON incluindo os cabeçalhos
//   const jsonData = data.map(row => {
//     const obj = {};
//     data[0].forEach((header, index) => {
//       obj[header] = row[index];
//     });
//     return obj;
//   });

//   fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2)); // Formatar para facilitar a leitura
//   console.log('Dados salvos em data.json');
// };

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp"
//   });
//   const page = await browser.newPage();

//   await page.goto('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

//   // Parte 1: Clicar no botão
//   await clickButton(page);

//   // Parte 2: Extrair cabeçalhos e dados da tabela
//   const data = await extractData(page);

//   // Parte 3: Gravar em CSV
//   saveToCSV(data);

//   // Parte 4: Gravar em JSON
//   saveToJSON(data);

//   await browser.close();
// })();