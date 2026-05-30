// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;

//         const $ = cheerio.load(html);

//         const data = [];

//         // Seletor CSS para as células da tabela
//         const cells = $('.stats_table tbody tr td');

//         // Iterar sobre as células da tabela
//         for (let i = 0; i < cells.length; i += 30) {
//             const player = $(cells[i + 1]).text().trim();
//             const nationality = $(cells[i + 2]).text().trim();
//             const position = $(cells[i + 3]).text().trim();
//             const team = $(cells[i + 4]).text().trim();
//             const age = $(cells[i + 5]).text().trim();
//             const matchesPlayed = $(cells[i + 6]).text().trim();
//             const starts = $(cells[i + 7]).text().trim();
//             const minutes = $(cells[i + 8]).text().trim();
//             const goals = $(cells[i + 10]).text().trim();
//             const assists = $(cells[i + 11]).text().trim();

//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists
//             };

//             data.push(playerData);
//         }

//         // Exibir os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);
//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchData() {
    const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

    try {
        const response = await axios.get(url);
        const html = response.data;
        
        // Salvar o HTML da página em um arquivo
        fs.writeFileSync('pagina.html', html);

        const $ = cheerio.load(html);
        
        const data = [];

        // Encontre o comentário que contém a tabela desejada
        const commentWithTable = $('body').contents().filter(function() {
            return this.nodeType === 8 && $(this).text().includes('Stats Table');
        });

        // Se a tabela estiver dentro de um comentário
        if (commentWithTable.length) {
            const tableHtml = commentWithTable.next().html();

            // Carregar o HTML da tabela usando cheerio
            const table = cheerio.load(tableHtml);

            // Seletor CSS para as linhas da tabela
            const rows = table('.stats_table tbody tr');

            // Iterar sobre as linhas da tabela
            rows.each((index, element) => {
                // Extrair os dados de cada coluna da linha
                const columns = table(element).find('td');
                const player = table(columns[1]).text();
                const nationality = table(columns[2]).text();
                const position = table(columns[3]).text();
                const team = table(columns[4]).text();
                const age = table(columns[5]).text();
                const matchesPlayed = table(columns[6]).text();
                const starts = table(columns[7]).text();
                const minutes = table(columns[8]).text();
                const goals = table(columns[10]).text();
                const assists = table(columns[11]).text();

                // Salvar os dados em um objeto
                const playerData = {
                    player,
                    nationality,
                    position,
                    team,
                    age,
                    matchesPlayed,
                    starts,
                    minutes,
                    goals,
                    assists
                };

                // Adicionar os dados do jogador ao array de dados
                data.push(playerData);
            });
        } else {
            console.log('Tabela não encontrada.');
        }

        // Exibir os dados extraídos
        console.log('Dados extraídos:', data);

        // Se desejar, você pode salvar esses dados em um arquivo CSV
        const csv = data.map(player => Object.values(player).join(',')).join('\n');
        fs.writeFileSync('dados_players.csv', csv);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

fetchData();

// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;
        
//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);
        
//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('.stats_table tbody tr');

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             const player = $(columns[1]).text();
//             const nationality = $(columns[2]).text();
//             const position = $(columns[3]).text();
//             const team = $(columns[4]).text();
//             const age = $(columns[5]).text();
//             const matchesPlayed = $(columns[6]).text();
//             const starts = $(columns[7]).text();
//             const minutes = $(columns[8]).text();
//             const goals = $(columns[10]).text();
//             const assists = $(columns[11]).text();

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Exibir os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();


// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;
        
//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);
        
//         const data = [];

//         // Seletor CSS para as linhas da segunda tabela
//         const rows = $('.stats_standard');

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             const player = $(columns[0]).text();
//             const nationality = $(columns[2]).text();
//             const position = $(columns[3]).text();
//             const team = $(columns[4]).text();
//             const age = $(columns[5]).text();
//             const matchesPlayed = $(columns[6]).text();
//             const starts = $(columns[7]).text();
//             const minutes = $(columns[8]).text();
//             const goals = $(columns[10]).text();
//             const assists = $(columns[11]).text();

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Exibir os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();


// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
        
//         // Verificar se a resposta foi bem-sucedida
//         if (response.status !== 200) {
//             throw new Error('Falha ao obter os dados. Código de status:', response.status);
//         }

//         const html = response.data;

//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);

//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('.table_container tbody tr');

//         // Verificando se as linhas foram encontradas
//         console.log("Número de linhas encontradas:", rows.length);

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             console.log("Número de colunas encontradas para a linha", index, ":", columns.length);

//             // Verificar se todas as colunas esperadas estão presentes
//             if (columns.length < 10) {
//                 console.warn(`A linha ${index} não contém todas as colunas esperadas.`);
//                 return; // Pular esta linha e continuar com a próxima
//           }
          
          

//             const player = $(columns).eq(1).text(); // Seletor para o nome do jogador
//             const position = $(columns).eq(2).text(); // Seletor para a posição do jogador
//             const team = $(columns).eq(3).text(); // Seletor para o time do jogador
//             const age = $(columns).eq(4).text(); // Seletor para a idade do jogador
//             const minutes = $(columns).eq(5).text(); // Seletor para os minutos jogados pelo jogador
//             const goals = $(columns).eq(6).text(); // Seletor para o número de gols marcados pelo jogador
//             const assists = $(columns).eq(7).text(); // Seletor para o número de assistências feitas pelo jogador
//             const yellowCards = $(columns).eq(8).text(); // Seletor para o número de cartões amarelos recebidos pelo jogador
//             const redCards = $(columns).eq(9).text(); // Seletor para o número de cartões vermelhos recebidos pelo jogador

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 position,
//                 team,
//                 age,
//                 minutes,
//                 goals,
//                 assists,
//                 yellowCards,
//                 redCards
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Verificando os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Verificando o número de dados extraídos
//         console.log('Número de dados extraídos:', data.length);

//         // Salvar os dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;

//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);

//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('.table_container tbody tr');

//         // Verificando se as linhas foram encontradas
//         console.log("Número de linhas encontradas:", rows.length);

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             console.log("Número de colunas encontradas para a linha", index, ":", columns.length);

//             const player = $(columns).eq(0).text(); // Seletor para o nome do jogador
//             const position = $(columns).eq(2).text(); // Seletor para a posição do jogador
//             const team = $(columns).eq(3).text(); // Seletor para o time do jogador
//             const age = $(columns).eq(4).text(); // Seletor para a idade do jogador
//             const minutes = $(columns).eq(5).text(); // Seletor para os minutos jogados pelo jogador
//             const goals = $(columns).eq(6).text(); // Seletor para o número de gols marcados pelo jogador
//             const assists = $(columns).eq(7).text(); // Seletor para o número de assistências feitas pelo jogador
//             const yellowCards = $(columns).eq(8).text(); // Seletor para o número de cartões amarelos recebidos pelo jogador
//             const redCards = $(columns).eq(9).text(); // Seletor para o número de cartões vermelhos recebidos pelo jogador

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 position,
//                 team,
//                 age,
//                 minutes,
//                 goals,
//                 assists,
//                 yellowCards,
//                 redCards
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Verificando os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Verificando o número de dados extraídos
//         console.log('Número de dados extraídos:', data.length);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();




// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;
        
//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);
        
//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('#stats_standard tbody tr');

//         // Verificando se as linhas foram encontradas
//         console.log("Número de linhas encontradas:", rows.length);

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             console.log("Número de colunas encontradas para a linha", index, ":", columns.length);
            
//             const player = $(columns[1]).text();
//             const nationality = $(columns[2]).text();
//             const position = $(columns[3]).text();
//             const team = $(columns[4]).text();
//             const age = $(columns[5]).text();
//             const matchesPlayed = $(columns[6]).text();
//             const starts = $(columns[7]).text();
//             const minutes = $(columns[8]).text();
//             const goals = $(columns[10]).text();
//             const assists = $(columns[11]).text();
//             const xG = $(columns[20]).text(); // Adicionando xG
//             const npxG = $(columns[21]).text(); // Adicionando npxG
//             const xAG = $(columns[22]).text(); // Adicionando xAG
//             const npxGxAG = $(columns[23]).text(); // Adicionando npxG+xAG
//             const progressiveCarries = $(columns[24]).text(); // Adicionando Progressive Carries
//             const progressivePasses = $(columns[25]).text(); // Adicionando Progressive Passes
//             const progressivePassesReceived = $(columns[26]).text(); // Adicionando Progressive Passes Received

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists,
//                 xG,
//                 npxG,
//                 xAG,
//                 npxGxAG,
//                 progressiveCarries,
//                 progressivePasses,
//                 progressivePassesReceived
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Verificando os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Verificando o número de dados extraídos
//         console.log('Número de dados extraídos:', data.length);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const html = response.data;
        
//         // Salvar o HTML da página em um arquivo
//         fs.writeFileSync('pagina.html', html);

//         const $ = cheerio.load(html);
        
//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('#stats_standard tbody tr');

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             const player = $(columns[1]).text();
//             const nationality = $(columns[2]).text();
//             const position = $(columns[3]).text();
//             const team = $(columns[4]).text();
//             const age = $(columns[5]).text();
//             const matchesPlayed = $(columns[6]).text();
//             const starts = $(columns[7]).text();
//             const minutes = $(columns[8]).text();
//             const goals = $(columns[10]).text();
//             const assists = $(columns[11]).text();

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Exibir os dados extraídos
//         console.log('Dados extraídos:', data);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// async function fetchData() {
//     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

//     try {
//         const response = await axios.get(url);
//         const $ = cheerio.load(response.data);
        
//         const data = [];

//         // Seletor CSS para as linhas da tabela
//         const rows = $('#stats_standard tbody tr');

//         // Iterar sobre as linhas da tabela
//         rows.each((index, element) => {
//             // Extrair os dados de cada coluna da linha
//             const columns = $(element).find('td');
//             const player = $(columns[1]).text();
//             const nationality = $(columns[2]).text();
//             const position = $(columns[3]).text();
//             const team = $(columns[4]).text();
//             const age = $(columns[5]).text();
//             const matchesPlayed = $(columns[6]).text();
//             const starts = $(columns[7]).text();
//             const minutes = $(columns[8]).text();
//             const goals = $(columns[10]).text();
//             const assists = $(columns[11]).text();

//             // Salvar os dados em um objeto
//             const playerData = {
//                 player,
//                 nationality,
//                 position,
//                 team,
//                 age,
//                 matchesPlayed,
//                 starts,
//                 minutes,
//                 goals,
//                 assists
//             };

//             // Adicionar os dados do jogador ao array de dados
//             data.push(playerData);
//         });

//         // Exibir os dados extraídos
//         console.log(data);

//         // Se desejar, você pode salvar esses dados em um arquivo CSV
//         const csv = data.map(player => Object.values(player).join(',')).join('\n');
//         fs.writeFileSync('dados_players.csv', csv);

//     } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//     }
// }

// fetchData();




// // const cheerio = require('cheerio');
// // const fs = require('fs');

// // // Carregar o conteúdo HTML da página fbref.com que contém a tabela
// // const html = fs.readFileSync('https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats');

// // // Carregar o conteúdo HTML no Cheerio
// // const $ = cheerio.load(html);

// // // Seletor CSS para as linhas da tabela
// // const rows = $('#stats_standard tbody tr');

// // // Iterar sobre as linhas da tabela
// // const data = [];
// // rows.each((index, element) => {
// //     // Extrair os dados de cada coluna da linha
// //     const columns = $(element).find('td');
// //     const player = $(columns[1]).text();
// //     const nationality = $(columns[2]).text();
// //     const position = $(columns[3]).text();
// //     const team = $(columns[4]).text();
// //     const age = $(columns[5]).text();
// //     const matchesPlayed = $(columns[6]).text();
// //     const starts = $(columns[7]).text();
// //     const minutes = $(columns[8]).text();
// //     const goals = $(columns[10]).text();
// //     const assists = $(columns[11]).text();

// //     // Salvar os dados em um objeto
// //     const playerData = {
// //         player,
// //         nationality,
// //         position,
// //         team,
// //         age,
// //         matchesPlayed,
// //         starts,
// //         minutes,
// //         goals,
// //         assists
// //     };

// //     // Adicionar os dados do jogador ao array de dados
// //     data.push(playerData);
// // });

// // // Exibir os dados extraídos
// // console.log(data);

// // // Se desejar, você pode salvar esses dados em um arquivo CSV
// // const csv = data.map(player => Object.values(player).join(',')).join('\n');
// // fs.writeFileSync('dados_players.csv', csv);
