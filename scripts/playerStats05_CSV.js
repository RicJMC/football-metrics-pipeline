const fs = require('fs').promises;
const { parse } = require('json2csv');

// Métricas e critérios de filtragem
// Métricas e critérios de filtragem
const metrics = {
    defesaconstroi_normalized: {
        metricKey: 'defesaconstroi_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    defesadestroi_normalized: {
        metricKey: 'defesadestroi_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    passing_normalized: {
        metricKey: 'passing_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    creationgoalshot_normalized: {
        metricKey: 'creationgoalshot_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    remate_normalized: {
        metricKey: 'remate_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    carrie_normalized: {
        metricKey: 'carrie_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    avfixo_normalized: {
        metricKey: 'avfixo_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    dribler_normalized: {
        metricKey: 'dribler_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    },
    avmovel_normalized: {
        metricKey: 'avmovel_normalized',
        filterCriteria: {
            games_starts: 0,
            minutes_90s: 3
        }
    }
};



// Função para ler os dados dos arquivos JSON
async function readJSONFiles(filenames) {
    try {
        const allData = [];
        for (const filename of filenames) {
            const data = await fs.readFile(filename, 'utf8');
            allData.push(JSON.parse(data));
        }
        return allData;
    } catch (error) {
        console.error(`Erro ao ler os arquivos JSON: ${error.message}`);
        return [];
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
        // Lista dos nomes dos arquivos JSON
        const filenames = [
            '../jsonfiles/playerStats03_ZScores_004_Metrics.json',
            '../jsonfiles/playerStats03_ZScores_104_Metrics.json',
            '../jsonfiles/playerStats03_ZScores_204_Metrics.json',
            '../jsonfiles/playerStats03_ZScores_304_Metrics.json'
        ];

        // Ler os dados de todos os arquivos JSON
        const allData = await readJSONFiles(filenames);
        
        // Concatenar os dados de todos os arquivos em uma única estrutura de dados
        const combinedData = allData.reduce((accumulator, currentValue) => {
            return { ...accumulator, ...currentValue };
        }, {});

        let csvData = [];
        let addedPlayers = new Set(); // Conjunto para manter controle dos jogadores adicionados

        // Arquivo de log para registrar os erros
        const logFile = 'ErrorLog_05.txt';
        let errorLog = '';
        
        // Lista das colunas a serem normalizadas
        const columnsToNormalize = [
            'def_c',
            'def_d',
            'pass',
            'crgolsh',
            'shoot',
            'carrie',
            'avfixo',
            'avmovel',
            'drib'
        ];

        // Iterar sobre cada métrica
        for (const metricName in metrics) {
            const { metricKey, filterCriteria } = metrics[metricName];

            // Iterar sobre os jogadores no arquivo JSON
            for (const playerName in combinedData) {
                const playerData = combinedData[playerName];
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

                                                // Calcular o total das métricas desejadas
// Calcular o total das métricas desejadas, considerando valores NaN ou undefined como 0
const total = (
    (isNaN(playerStats['defesadestroi_normalized']) ? 0 : playerStats['defesadestroi_normalized']) +
    (isNaN(playerStats['passing_normalized']) ? 0 : playerStats['passing_normalized']) +
    (isNaN(playerStats['creationgoalshot_normalized']) ? 0 : playerStats['creationgoalshot_normalized']) +
    (isNaN(playerStats['remate_normalized']) ? 0 : playerStats['remate_normalized']) +
    (isNaN(playerStats['carrie_normalized']) ? 0 : playerStats['carrie_normalized'])
);
                            const playerEntry = {
                                Player: playerName,
                                Season: seasonKey,
                                League: playerStats['League'],
                                League2: playerStats['comp_level'],
                                Nationality: playerStats['Nationality'], // Adicionando campo Nationality
                                Age: playerStats['Age'],
                                BY: playerStats['BirthYear'],
                                Team: teamName,
                                pos: playerStats['position'], // Adicionando campo position
                                games: playerStats['games'], // Adicionando campo games
                                starts: playerStats['games_starts'], // Adicionando campo games_starts
                                m90s: playerStats['minutes_90s'], // Adicionando campo minutes_90s
                                def_c: playerStats['defesaconstroi_normalized'],
                                def_d: playerStats['defesadestroi_normalized'],
                                gk: playerStats['goalkeeper_normalized'],
                                pass: playerStats['passing_normalized'],
                                crgolsh: playerStats['creationgoalshot_normalized'],
                                shoot: playerStats['remate_normalized'],
                                carrie: playerStats['carrie_normalized'],
                                avfixo: playerStats['avfixo_normalized'],
                                drib: playerStats['dribler_normalized'],
                                avmovel: playerStats['avmovel_normalized'],
                                total_raw: total,
//                                 shots_zScore: playerStats['shots_zScore'],
// shots_on_target_zScore: playerStats['shots_on_target_zScore'],
// shots_on_target_pct_zScore: playerStats['shots_on_target_pct_zScore'],
// shots_per90_zScore: playerStats['shots_per90_zScore'],
// shots_on_target_per90_zScore: playerStats['shots_on_target_per90_zScore'],
// goals_per_shot_zScore: playerStats['goals_per_shot_zScore'],
// goals_per_shot_on_target_zScore: playerStats['goals_per_shot_on_target_zScore'],
// npxg: playerStats['npxg'],
// npxg_per_shot_zScore: playerStats['npxg_per_shot_zScore'],
// xg_net_zScore: playerStats['xg_net_zScore'],
// progressive_passes_received_zScore: playerStats['progressive_passes_received_zScore'],
// aerials_won_pct_zScore: playerStats['aerials_won_pct_zScore'],
// aerials_won_zScore: playerStats['aerials_won_zScore'],
// touches_att_pen_area_zScore: playerStats['touches_att_pen_area_zScore'],
// sca_take_ons_zScore: playerStats['sca_take_ons_zScore'],
// gca_take_ons_zScore: playerStats['gca_take_ons_zScore'],
// gca_shots_zScore: playerStats['gca_shots_zScore'],
// sca_shots_zScore: playerStats['sca_shots_zScore'],
// sca_fouled_zScore: playerStats['sca_fouled_zScore'],
// gca_fouled_zScore: playerStats['gca_fouled_zScore'],
// tackles_att_3rd_zScore: playerStats['tackles_att_3rd_zScore'],
// touches_att_3rd_zScore: playerStats['touches_att_3rd_zScore'],
// take_ons_won_zScore: playerStats['take_ons_won_zScore'],
// take_ons_won_pct_zScore: playerStats['take_ons_won_pct_zScore'],
// progressive_carries_zScore: playerStats['progressive_carries_zScore'],
// carries_into_final_third_zScore: playerStats['carries_into_final_third_zScore'],
// carries_into_penalty_area_zScore: playerStats['carries_into_penalty_area_zScore'],
// ball_recoveries_zScore: playerStats['ball_recoveries_zScore'],
// crosses_into_penalty_area_zScore: playerStats['crosses_into_penalty_area_zScore'],
// crosses_zScore: playerStats['crosses_zScore'],
// fouled_zScore: playerStats['fouled_zScore'],
// progressive_passes_received_zScore: playerStats['progressive_passes_received_zScore'],
// progressive_carries_zScore: playerStats['progressive_carries_zScore'],
// carries_into_final_third_zScore: playerStats['carries_into_final_third_zScore'],
// carries_into_penalty_area_zScore: playerStats['carries_into_penalty_area_zScore'],
// carries_zScore: playerStats['carries_zScore'],
// carries_distance_zScore: playerStats['carries_distance_zScore'],
// carries_progressive_distance_zScore: playerStats['carries_progressive_distance_zScore'],
// take_ons_tackled_zScore: playerStats['take_ons_tackled_zScore'],
// take_ons_won_zScore: playerStats['take_ons_won_zScore'],
// touches_live_ball_zScore: playerStats['touches_live_ball_zScore'],
// touches_att_pen_area_zScore: playerStats['touches_att_pen_area_zScore'],
// touches_att_3rd_zScore: playerStats['touches_att_3rd_zScore'],
// tackles_interceptions_zScore: playerStats['tackles_interceptions_zScore'],
// blocks_zScore: playerStats['blocks_zScore'],
// challenge_tackles_zScore: playerStats['challenge_tackles_zScore'],
// challenges_lost_zScore: playerStats['challenges_lost_zScore'],
// gca_fouled_zScore: playerStats['gca_fouled_zScore'],
// gca_shots_zScore: playerStats['gca_shots_zScore'],
// gca_take_ons_zScore: playerStats['gca_take_ons_zScore'],
// gca_per90_zScore: playerStats['gca_per90_zScore'],
// sca_fouled_zScore: playerStats['sca_fouled_zScore'],
// sca_shots_zScore: playerStats['sca_shots_zScore'],
// sca_take_ons_zScore: playerStats['sca_take_ons_zScore'],
// sca_per90_zScore: playerStats['sca_per90_zScore'],
// progressive_passes_zScore: playerStats['progressive_passes_zScore'],
// xg_assist_per90_zScore: playerStats['xg_assist_per90_zScore'],
// pass_xa_zScore: playerStats['pass_xa_zScore'],
// assisted_shots_zScore: playerStats['assisted_shots_zScore'],
// passes_into_final_third_zScore: playerStats['passes_into_final_third_zScore'],
// passes_into_penalty_area_zScore: playerStats['passes_into_penalty_area_zScore'],
// crosses_into_penalty_area_zScore: playerStats['crosses_into_penalty_area_zScore'],
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

        // Normalizar os dados CSV
        csvData = await normalizeCsvData(csvData, columnsToNormalize);

        // Converter dados CSV para formato CSV
        const csv = parse(csvData);

        // Escrever dados CSV em um arquivo
        await fs.writeFile('../csv/playerStatstoCSV1-3.csv', csv);

        console.log('Dados exportados para playerStatstoCSV1-3.csv com sucesso!');
    } catch (error) {
        console.error(`Erro no programa: ${error}`);
    }
}

// Chamar a função principal
main();