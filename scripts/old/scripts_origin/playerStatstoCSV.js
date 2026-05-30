const fs = require('fs').promises;
const { parse } = require('json2csv');

// Métricas e critérios de filtragem
// Métricas e critérios de filtragem
const metrics = {
    defesaconstroi_normalized: {
        metricKey: 'defesaconstroi_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    defesadestroi_normalized: {
        metricKey: 'defesadestroi_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    passing_normalized: {
        metricKey: 'passing_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    creationgoalshot_normalized: {
        metricKey: 'creationgoalshot_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    remate_normalized: {
        metricKey: 'remate_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    carrie_normalized: {
        metricKey: 'carrie_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    avfixo_normalized: {
        metricKey: 'avfixo_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    },
    avmovel_normalized: {
        metricKey: 'avmovel_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 4
        }
    }
};


// Função para ler os dados do arquivo JSON
async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo JSON ${filename}: ${error.message}`);
        return {};
    }
}

// Função para normalizar os valores de uma coluna entre 0 e 1
function normalizeColumn(data, columnName) {
    const columnValues = data.map(entry => entry[columnName]);
    const filteredValues = columnValues.filter(value => value !== undefined && !isNaN(value));
    
    if (filteredValues.length === 0) {
        // Se não houver valores válidos, retornar os dados originais
        return data;
    }

    const min = Math.min(...filteredValues);
    const max = Math.max(...filteredValues);
    return data.map(entry => {
        const value = entry[columnName];
        if (value === undefined || isNaN(value)) {
            // Substituir valores undefined e NaN por 0
            return { ...entry, [columnName]: 0 };
        }
        return { ...entry, [columnName]: (value - min) / (max - min) };
    });
}

// Função para normalizar todas as colunas de interesse em csvData
async function normalizeCsvData(csvData, columnsToNormalize) {
    let normalizedCsvData = [...csvData]; // Faz uma cópia dos dados originais
    
    for (const columnName of columnsToNormalize) {
        normalizedCsvData = normalizeColumn(normalizedCsvData, columnName);
    }
    
    return normalizedCsvData;
}


// Função principal assíncrona
async function main() {
    try {
        // Ler os dados do arquivo JSON
        const jsonData = await readJSONFile('playerStatsWithMetrics.json');
        let csvData = [];
        let addedPlayers = new Set(); // Conjunto para manter controle dos jogadores adicionados

        // Arquivo de log para registrar os erros
        const logFile = 'playerstatstocsv.txt';
        let errorLog = '';
        
        
        // Lista das colunas a serem normalizadas
        const columnsToNormalize = [
            'def_constroi',
            'def_destroi',
            'pass',
            'creatgolshot',
            'remate',
            'carrie',
            'avfixo',
            'avmovel'
        ];

        // Iterar sobre cada métrica
        for (const metricName in metrics) {
            const { metricKey, filterCriteria } = metrics[metricName];

            // Iterar sobre os jogadores no arquivo JSON
            for (const playerName in jsonData) {
                const playerData = jsonData[playerName];
                const seasons = playerData['Seasons'];

                // Verificar se o jogador já foi adicionado
                if (addedPlayers.has(playerName)) {
                    continue; // Se já foi adicionado, passar para o próximo jogador
                }

                for (const seasonKey in seasons) {
                    const teams = seasons[seasonKey]['Teams'];
                    for (const teamName in teams) {
                        const playerStats = teams[teamName];
                        const leagueAndSeason = `${playerStats['League']}_${seasonKey}`;
                        const criteriaMet = Object.entries(filterCriteria).every(([key, value]) => playerStats[key] >= value);
                        if (criteriaMet && !isNaN(playerStats[metricKey])) {
                            const playerEntry = {
                                Player: playerName,
                                Season: seasonKey,
                                League: playerStats['League'],
                                League2: playerStats['comp_level'],
                                Nationality: playerStats['Nationality'], // Adicionando campo Nationality
                                Age: playerStats['Age'],
                                Team: teamName,
                                pos: playerStats['position'], // Adicionando campo position
                                games: playerStats['games'], // Adicionando campo games
                                starts: playerStats['games_starts'], // Adicionando campo games_starts
                                m90s: playerStats['minutes_90s'], // Adicionando campo minutes_90s
                                def_constroi: playerStats['defesaconstroi_normalized'],
                                def_destroi: playerStats['defesadestroi_normalized'],
                                pass: playerStats['passing_normalized'],
                                creatgolshot: playerStats['creationgoalshot_normalized'],
                                remate: playerStats['remate_normalized'],
                                carrie: playerStats['carrie_normalized'],
                                avfixo: playerStats['avfixo_normalized'],
                                avmovel: playerStats['avmovel_normalized'],
                                [metricKey]: playerStats[metricKey]
                            };
                            
                            
                            csvData.push(playerEntry);
                            addedPlayers.add(playerName); // Adicionar jogador ao conjunto de jogadores adicionados
                        } else {
                            // Registro de valores NaN no log
                            errorLog += `Valor NaN encontrado para ${metricKey} em ${playerName} (${seasonKey}, ${teamName})\n`;
                        }
                    }
                }
            }
        }
        // Escrever o log de erros em um arquivo
        await fs.writeFile(logFile, errorLog);

        
        csvData = await normalizeCsvData(csvData, columnsToNormalize);

        // Converter dados CSV para formato CSV
        const csv = parse(csvData);

        // Escrever dados CSV em um arquivo
        await fs.writeFile('playerStatstoCSV0-4.csv', csv);

        console.log('Dados exportados para playerStatstoCSV0-4.csv com sucesso!');
    } catch (error) {
        console.error(`Erro no programa: ${error}`);
    }
}

// Chamar a função principal
main();


























// // Função principal assíncrona (TODOS OS JOGADORES)
// async function main() {
//     try {
//         // Ler os dados do arquivo JSON
//         const jsonData = await readJSONFile('playerStatsWithMetrics.json');
//         const csvData = [];

//         // Iterar sobre cada métrica
//         for (const metricName in metrics) {
//             const { metricKey, filterCriteria } = metrics[metricName];
//             const players = new Set();
//             const topPlayersByLeagueAndSeason = {};

//             // Iterar sobre os jogadores no arquivo JSON
//             for (const playerName in jsonData) {
//                 const playerData = jsonData[playerName];
//                 const seasons = playerData['Seasons'];
//                 for (const seasonKey in seasons) {
//                     const teams = seasons[seasonKey]['Teams'];
//                     for (const teamName in teams) {
//                         const playerStats = teams[teamName];
//                         const leagueAndSeason = `${playerStats['League']}_${seasonKey}`;
//                         const criteriaMet = Object.entries(filterCriteria).every(([key, value]) => playerStats[key] >= value);
//                         if (criteriaMet && !isNaN(playerStats[metricKey])) {
//                             const playerEntry = {
//                                 Player: playerName,
//                                 League: playerStats['League'],
//                                 Age: playerStats['Age'],
//                                 Team: teamName,
//                                 games_starts: playerStats['games_starts'],
//                                 Season: seasonKey,
//                                 defesaconstroi_normalized:playerStats['defesaconstroi_normalized'],
//                                 defesadestroi_normalized: playerStats['defesadestroi_normalized'],
//                                 passing_normalized: playerStats['passing_normalized'],
//                                 creationgoalshot_normalized: playerStats['creationgoalshot_normalized'],
//                                 remate_normalized: playerStats['remate_normalized'],
//                                 carrie_normalized: playerStats['carrie_normalized'],
//                                 avfixo_normalized: playerStats['avfixo_normalized'],
//                                 avmovel_normalized: playerStats['avmovel_normalized'],
//                                 [metricKey]: playerStats[metricKey]
//                             };
//                             // Verificar se o jogador já foi adicionado
//                             if (!players.has(JSON.stringify(playerEntry))) {
//                                 players.add(JSON.stringify(playerEntry));
//                                 csvData.push(playerEntry);
//                             }
//                             // Adicionar jogador ao array de melhores jogadores por liga e temporada
//                             if (!topPlayersByLeagueAndSeason[leagueAndSeason]) {
//                                 topPlayersByLeagueAndSeason[leagueAndSeason] = new Set();
//                             }
//                             if (!topPlayersByLeagueAndSeason[leagueAndSeason].has(JSON.stringify(playerEntry))) {
//                                 topPlayersByLeagueAndSeason[leagueAndSeason].add(JSON.stringify(playerEntry));
//                                 csvData.push(playerEntry);
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         // Converter dados CSV para formato CSV
//         const csv = parse(csvData);

//         // Escrever dados CSV em um arquivo
//         await fs.writeFile('playerStatsWithMetrics.csv', csv);

//         console.log('Dados exportados para playerStatsWithMetrics.csv com sucesso!');
//     } catch (error) {
//         console.error(`Erro no programa: ${error}`);
//     }
// }
















// // Função para ler os dados do arquivo JSON
// async function readJSONFile(filename) {
//     try {
//         const data = await fs.readFile(filename, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error(`Erro ao ler o arquivo JSON ${filename}: ${error.message}`);
//         return {};
//     }
// }

// // Função principal assíncrona
// async function main() {
//     try {
//         // Ler os dados do arquivo JSON
//         const jsonData = await readJSONFile('playerStatsWithMetrics.json');
//         const csvData = [];

//         // Iterar sobre cada métrica
//         for (const metricName in metrics) {
//             const { metricKey, filterCriteria } = metrics[metricName];
//             const players = [];
//             const topPlayersByLeagueAndSeason = {}; // Armazena os top players por liga e temporada

// // Iterar sobre os jogadores no arquivo JSON
// for (const playerName in jsonData) {
//     const playerData = jsonData[playerName];
//     const seasons = playerData['Seasons'];
//     for (const seasonKey in seasons) {
//         const teams = seasons[seasonKey]['Teams'];
//         for (const teamName in teams) {
//             const playerStats = teams[teamName];
//             const leagueAndSeason = `${playerStats['League']}_${seasonKey}`;
//             // Verificar se o jogador atende aos critérios para a métrica atual
//             const criteriaMet = Object.entries(filterCriteria).every(([key, value]) => playerStats[key] >= value);
//             if (criteriaMet && !isNaN(playerStats[metricKey])) {
//                 // Adicionar jogador ao array
//                 players.push({
//                     Player: playerName,
//                     League: playerStats['League'], // Adicionando a liga
//                     [metricKey]: playerStats[metricKey],
//                     Age: playerStats['Age'],
//                     Team: teamName,
//                     games_starts: playerStats['games_starts'],
//                     Season: seasonKey, // Adicionando a temporada (season)
//                     defesadestroi_normalized: playerStats['defesadestroi_normalized'],
//                     passing_normalized: playerStats['passing_normalized'],
//                     creationgoalshot_normalized: playerStats['creationgoalshot_normalized'],
//                     remate_normalized: playerStats['remate_normalized'],
//                     carrie_normalized: playerStats['carrie_normalized'],
//                     avfixo_normalized: playerStats['avfixo_normalized'],
//                     avmovel_normalized: playerStats['avmovel_normalized']
//                 });
//                 // Adicionando jogador ao array de melhores jogadores por liga e temporada
//                 if (!topPlayersByLeagueAndSeason[leagueAndSeason]) {
//                     topPlayersByLeagueAndSeason[leagueAndSeason] = [];
//                 }
//                 topPlayersByLeagueAndSeason[leagueAndSeason].push({
//                     Player: playerName,
//                     [metricKey]: playerStats[metricKey],
//                     Team: teamName,
//                     games_starts: playerStats['games_starts'],
//                     defesadestroi_normalized: playerStats['defesadestroi_normalized'],
//                     passing_normalized: playerStats['passing_normalized'],
//                     creationgoalshot_normalized: playerStats['creationgoalshot_normalized'],
//                     remate_normalized: playerStats['remate_normalized'],
//                     carrie_normalized: playerStats['carrie_normalized'],
//                     avfixo_normalized: playerStats['avfixo_normalized'],
//                     avmovel_normalized: playerStats['avmovel_normalized']
//                 });
//             }
//         }
//     }
//             }
//             // Ordenar jogadores por métrica em ordem decrescente
//             players.sort((a, b) => b[metricKey] - a[metricKey]);

//             // Adicionar os 300 primeiros jogadores ao array de dados CSV
//             players.slice(0, 300).forEach((player) => {
//                 csvData.push({
//                     Player: player.Player,
//                     League: player.League,
//                     Age: player.Age,
//                     Team: player.Team,
//                     games_starts: player.games_starts,
//                     Season: player.Season,
//                     [metricKey]: player[metricKey],
//                 });
//             });

//             // Adicionar os top 50 jogadores de cada liga e temporada ao array de dados CSV
//             for (const leagueSeason in topPlayersByLeagueAndSeason) {
//                 const topPlayers = topPlayersByLeagueAndSeason[leagueSeason].sort((a, b) => b[metricKey] - a[metricKey]).slice(0, 50);
//                 topPlayers.forEach((player) => {
//                     csvData.push({
//                         Player: player.Player,
//                         League: leagueSeason.split('_')[0],
//                         Age: '', // Não temos idade para os top players por liga e temporada
//                         Team: player.Team,
//                         games_starts: player.games_starts,
//                         Season: leagueSeason.split('_')[1],
//                         [metricKey]: player[metricKey],
//                         // Adicionar as métricas adicionais
//                         defesadestroi_normalized: player.defesadestroi_normalized,
//                         passing_normalized: player.passing_normalized,
//                         creationgoalshot_normalized: player.creationgoalshot_normalized,
//                         remate_normalized: player.remate_normalized,
//                         carrie_normalized: player.carrie_normalized,
//                         avfixo_normalized: player.avfixo_normalized,
//                         avmovel_normalized: player.avmovel_normalized
//                     });
//                 });
//             }
//         }

//         // Converter dados CSV para formato CSV
//         const csv = parse(csvData);

//         // Escrever dados CSV em um arquivo
//         await fs.writeFile('playerStatsWithMetrics.csv', csv);

//         console.log('Dados exportados para playerStatsWithMetrics.csv com sucesso!');
//     } catch (error) {
//         console.error(`Erro no programa: ${error}`);
//     }
// }

// // Chamar a função principal
// main();


// // Função para ler os dados do arquivo JSON
// async function readJSONFile(filename) {
//     try {
//         const data = await fs.readFile(filename, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error(`Erro ao ler o arquivo JSON ${filename}: ${error.message}`);
//         return {};
//     }
// }

// // Função principal assíncrona
// async function main() {
//     try {
//         // Ler os dados do arquivo JSON
//         const jsonData = await readJSONFile('playerStatsWithMetrics.json');
//         const csvData = [];

//         // Iterar sobre cada métrica
//         for (const metricName in metrics) {
//             const { metricKey, filterCriteria } = metrics[metricName];
//             const players = [];

//             // Iterar sobre os jogadores no arquivo JSON
//             for (const playerName in jsonData) {
//                 const playerData = jsonData[playerName];
//                 const seasons = playerData['Seasons'];
//                 for (const seasonKey in seasons) {
//                     const teams = seasons[seasonKey]['Teams'];
//                     for (const teamName in teams) {
//                         const playerStats = teams[teamName];
//                         // Verificar se o jogador atende aos critérios para a métrica atual
//                         const criteriaMet = Object.entries(filterCriteria).every(([key, value]) => playerStats[key] >= value);
//                         if (criteriaMet && !isNaN(playerStats[metricKey])) {
//                             // Adicionar jogador ao array
//                             players.push({
//                                 Player: playerName,
//                                 League: playerStats['League'], // Adicionando a liga
//                                 [metricKey]: playerStats[metricKey],
//                                 Age: playerStats['Age'],
//                                 Team: teamName,
//                                 games_starts: playerStats['games_starts'],
//                                 Season: seasonKey // Adicionando a temporada (season)
//                             });
//                         }
//                     }
//                 }
//             }

//             // Ordenar jogadores por métrica em ordem decrescente
//             players.sort((a, b) => b[metricKey] - a[metricKey]);

//             // Adicionar os 50 primeiros jogadores ao array de dados CSV
//             players.slice(0, 300).forEach((player) => {
//                 csvData.push({
//                     Player: player.Player,
//                     League: player.League,
//                     Age: player.Age,
//                     Team: player.Team,
//                     games_starts: player.games_starts,
//                     Season: player.Season,
//                     [metricKey]: player[metricKey],
//                 });
//             });
//         }

//         // Converter dados CSV para formato CSV
//         const csv = parse(csvData);

//         // Escrever dados CSV em um arquivo
//         await fs.writeFile('playerStatsWithMetrics.csv', csv);

//         console.log('Dados exportados para playerStatsWithMetrics.csv com sucesso!');
//     } catch (error) {
//         console.error(`Erro no programa: ${error}`);
//     }
// }

// // Chamar a função principal
// main();