const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchData() {
    const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

    try {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const data = [];

        // Seletor CSS para as células da tabela
        const cells = $('.stats_table tbody tr');

        // Iterar sobre as linhas da tabela
        cells.each((index, element) => {
            // Filtrar os comentários dentro da linha
            const comments = $(element).contents().filter((index, el) => el.nodeType === 8);
            // Iterar sobre os comentários
            comments.each((index, comment) => {
                // Extrair dados dos comentários
                const commentData = cheerio.load(comment.data);
                const player = commentData('.th').first().text().trim();
                const nationality = commentData('.th').eq(1).text().trim();
                const position = commentData('.th').eq(2).text().trim();
                const team = commentData('.th').eq(3).text().trim();
                const age = commentData('.th').eq(4).text().trim();
                const matchesPlayed = commentData('.th').eq(5).text().trim();
                const starts = commentData('.th').eq(6).text().trim();
                const minutes = commentData('.th').eq(7).text().trim();
                const goals = commentData('.th').eq(8).text().trim();
                const assists = commentData('.th').eq(9).text().trim();

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

                data.push(playerData);
            });
        });

        // Exibir os dados extraídos
        console.log(data);

        // Se desejar, você pode salvar esses dados em um arquivo JSON
        fs.writeFileSync('dados.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Executar a função para buscar e processar os dados
fetchData();


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
//         const cells = $('.stats_table tbody tr');

//         // Iterar sobre as linhas da tabela
//         cells.each((index, element) => {
//             // Filtrar os comentários dentro da linha
//             const comments = $(element).contents().filter((index, el) => el.nodeType === 8);
//             // Iterar sobre os comentários
//             comments.each((index, comment) => {
//                 // Extrair dados dos comentários
//                 const commentData = cheerio.load(comment.data);
//                 const player = commentData('.section_heading').text().trim();
//                 const nationality = commentData('.section_heading').next().text().trim();
//                 const position = commentData('.section_heading').next().next().text().trim();
//                 const team = commentData('.section_heading').next().next().next().text().trim();
//                 const age = commentData('.section_heading').next().next().next().next().text().trim();
//                 const matchesPlayed = commentData('.section_heading').next().next().next().next().next().text().trim();
//                 const starts = commentData('.section_heading').next().next().next().next().next().next().text().trim();
//                 const minutes = commentData('.section_heading').next().next().next().next().next().next().next().text().trim();
//                 const goals = commentData('.section_heading').next().next().next().next().next().next().next().next().text().trim();
//                 const assists = commentData('.section_heading').next().next().next().next().next().next().next().next().next().text().trim();

//                 const playerData = {
//                     player,
//                     nationality,
//                     position,
//                     team,
//                     age,
//                     matchesPlayed,
//                     starts,
//                     minutes,
//                     goals,
//                     assists
//                 };

//                 data.push(playerData);
//             });
//         });


// // const axios = require('axios');
// // const cheerio = require('cheerio');
// // const fs = require('fs');

// // async function fetchData() {
// //     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

// //     try {
// //         const response = await axios.get(url);
// //         const html = response.data;
        
// //         // Salvar o HTML da página em um arquivo
// //         fs.writeFileSync('pagina.html', html);

// //         const $ = cheerio.load(html, {
// //             // Define ignoreWhitespace como true para ignorar os comentários ao fazer a análise
// //             xmlMode: true,
// //             ignoreWhitespace: true
// //         });
        
// //         const data = [];

// //         // Seletor CSS para as linhas da tabela
// //         const rows = $('.stats_table tbody tr');

// //         // Iterar sobre as linhas da tabela
// //         rows.each((index, element) => {
// //             // Extrair os dados de cada coluna da linha
// //             const columns = $(element).find('td');
// //             const player = $(columns[1]).text();
// //             const nationality = $(columns[2]).text();
// //             const position = $(columns[3]).text();
// //             const team = $(columns[4]).text();
// //             const age = $(columns[5]).text();
// //             const matchesPlayed = $(columns[6]).text();
// //             const starts = $(columns[7]).text();
// //             const minutes = $(columns[8]).text();
// //             const goals = $(columns[10]).text();
// //             const assists = $(columns[11]).text();

// //             // Salvar os dados em um objeto
// //             const playerData = {
// //                 player,
// //                 nationality,
// //                 position,
// //                 team,
// //                 age,
// //                 matchesPlayed,
// //                 starts,
// //                 minutes,
// //                 goals,
// //                 assists
// //             };

// //             // Adicionar os dados do jogador ao array de dados
// //             data.push(playerData);
// //         });

// //         // Exibir os dados extraídos
// //         console.log('Dados extraídos:', data);

// //         // Se desejar, você pode salvar esses dados em um arquivo CSV
// //         const csv = data.map(player => Object.values(player).join(',')).join('\n');
// //         fs.writeFileSync('dados_players.csv', csv);

// //     } catch (error) {
// //         console.error('Erro ao buscar dados:', error);
// //     }
// // }

// // fetchData();

// // // const axios = require('axios');
// // // const cheerio = require('cheerio');
// // // const fs = require('fs');

// // // async function fetchData() {
// // //     const url = 'https://fbref.com/en/comps/32/stats/Primeira-Liga-Stats';

// // //     try {
// // //         const response = await axios.get(url);
// // //         const html = response.data;

// // //         const $ = cheerio.load(html);

// // //         const data = [];

// // //         // Seletor CSS para as células da tabela
// // //         const cells = $('.stats_table tbody tr');

// // //         // Iterar sobre as linhas da tabela
// // //         cells.each((index, element) => {
// // //             // Filtrar os comentários dentro da linha
// // //             const comments = $(element).contents().filter((index, el) => el.nodeType === 8);
// // //             // Iterar sobre os comentários
// // //             comments.each((index, comment) => {
// // //                 // Extrair dados dos comentários
// // //                 const commentData = cheerio.load(comment.data);
// // //                 const player = commentData('.section_heading').text().trim();
// // //                 const nationality = commentData('.section_heading').next().text().trim();
// // //                 const position = commentData('.section_heading').next().next().text().trim();
// // //                 const team = commentData('.section_heading').next().next().next().text().trim();
// // //                 const age = commentData('.section_heading').next().next().next().next().text().trim();
// // //                 const matchesPlayed = commentData('.section_heading').next().next().next().next().next().text().trim();
// // //                 const starts = commentData('.section_heading').next().next().next().next().next().next().text().trim();
// // //                 const minutes = commentData('.section_heading').next().next().next().next().next().next().next().text().trim();
// // //                 const goals = commentData('.section_heading').next().next().next().next().next().next().next().next().text().trim();
// // //                 const assists = commentData('.section_heading').next().next().next().next().next().next().next().next().next().text().trim();

// // //                 const playerData = {
// // //                     player,
// // //                     nationality,
// // //                     position,
// // //                     team,
// // //                     age,
// // //                     matchesPlayed,
// // //                     starts,
// // //                     minutes,
// // //                     goals,
// // //                     assists
// // //                 };

// // //                 data.push(playerData);
// // //             });
// // //         });

// // //         // Exibir os dados extraídos
// // //         console.log('Dados extraídos:', data);

// // //         // Se desejar, você pode salvar esses dados em um arquivo CSV
// // //         const csv = data.map(player => Object.values(player).join(',')).join('\n');
// // //         fs.writeFileSync('dados_players.csv', csv);
// // //     } catch (error) {
// // //         console.error('Erro ao buscar dados:', error);
// // //     }
// // // }

// // // fetchData();

