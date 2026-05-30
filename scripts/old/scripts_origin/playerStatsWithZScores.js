const fs = require('fs');
const ss = require('simple-statistics');

// Função para calcular a média e o desvio padrão para todos os valores numéricos
function calculateStats(data, logFile) {
  const stats = {};

  // Percorrer os jogadores
  for (const jogador in data) {
    const seasons = data[jogador].Seasons;

    // Percorrer as temporadas do jogador
    for (const season in seasons) {
      const teams = seasons[season].Teams;

      // Percorrer os times de cada temporada
      for (const team in teams) {
        const teamData = teams[team];

        // Percorrer os atributos do time
        for (const key in teamData) {
          const value = teamData[key];

          // Verificar se o valor é numérico
          if (typeof value === 'number') {
            if (!stats[key]) {
              stats[key] = [];
            }
            stats[key].push(value);
          }
        }
      }
    }
  }

  // Calcular média e desvio padrão para cada atributo
  for (const key in stats) {
    stats[key] = {
      mean: ss.mean(stats[key]),
      stdDev: ss.standardDeviation(stats[key])
    };
  }

  return stats;
}

// Função para adicionar os Z-scores aos dados
function addZScores(data, stats, logFile) {
  // Percorrer os jogadores
  for (const jogador in data) {
    const seasons = data[jogador].Seasons;

    // Percorrer as temporadas do jogador
    for (const season in seasons) {
      const teams = seasons[season].Teams;

      // Percorrer os times de cada temporada
      for (const team in teams) {
        const teamData = teams[team];

        // Percorrer os atributos do time
        for (const key in teamData) {
          const value = teamData[key];

          // Verificar se o valor é numérico
          if (typeof value === 'number') {
            // Verificar se o atributo existe nos stats
            if (stats[key]) {
              const mean = stats[key].mean;
              const stdDev = stats[key].stdDev;

              // Calcular o Z-score e adicioná-lo aos dados
              const zScore = (value - mean) / stdDev;
              teamData[`${key}_zScore`] = zScore;
            } else {
              fs.appendFileSync(logFile, `Erro: Estatísticas para '${key}' não foram encontradas.\n`);
            }
          }
        }
      }
    }
  }

  return data;
}

// Ler os dados do arquivo JSON
const jsonData = fs.readFileSync('playerStatsNumerical.json');
const data = JSON.parse(jsonData);

// Nome do arquivo de log
const logFile = 'errorLog.txt';

// Calcular a média e o desvio padrão para todos os valores numéricos
const stats = calculateStats(data, logFile);

// Adicionar Z-scores aos dados
const dataWithZScores = addZScores(data, stats, logFile);

// Salvar os dados atualizados em um novo arquivo JSON
fs.writeFileSync('playerStatsWithZScores.json', JSON.stringify(dataWithZScores, null, 2));

console.log('Z-scores adicionados com sucesso!');







// const fs = require('fs');
// const ss = require('simple-statistics');

// // Função para calcular a média e o desvio padrão para todos os valores numéricos
// function calculateStats(data) {
//   const stats = {};

//   // Percorrer os jogadores
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Percorrer os atributos do time
//         for (const key in teamData) {
//           const value = teamData[key];

//           // Verificar se o valor é numérico
//           if (typeof value === 'number') {
//             if (!stats[key]) {
//               stats[key] = [];
//             }
//             stats[key].push(value);
//           }
//         }
//       }
//     }
//   }

//   // Calcular média e desvio padrão para cada atributo
//   for (const key in stats) {
//     stats[key] = {
//       mean: ss.mean(stats[key]),
//       stdDev: ss.standardDeviation(stats[key])
//     };
//   }

//   return stats;
// }

// // Função para adicionar os Z-scores aos dados
// function addZScores(data, stats) {
//   // Percorrer os jogadores
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Percorrer os atributos do time
//         for (const key in teamData) {
//           const value = teamData[key];

//           // Verificar se o valor é numérico
//           if (typeof value === 'number') {
//             // Verificar se o atributo existe nos stats
//             if (stats[key]) {
//               const mean = stats[key].mean;
//               const stdDev = stats[key].stdDev;

//               // Calcular o Z-score e adicioná-lo aos dados
//               const zScore = (value - mean) / stdDev;
//               teamData[`${key}_zScore`] = zScore;
//             } else {
//               // console.error(`Estatísticas para '${key}' não foram encontradas.`);
//             }
//           }
//         }
//       }
//     }
//   }

//   return data;
// }

// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsNumerical.json');
// const data = JSON.parse(jsonData);

// // Calcular a média e o desvio padrão para todos os valores numéricos
// const stats = calculateStats(data);

// // Adicionar Z-scores aos dados
// const dataWithZScores = addZScores(data, stats);

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync('playerStatsWithZScores.json', JSON.stringify(dataWithZScores, null, 2));

// console.log('Z-scores adicionados com sucesso!');









// const fs = require('fs');
// const ss = require('simple-statistics');


// function calculateStats(data) {
//   const stats = {};
//   for (const key in data) {
//       if (typeof data[key] === 'number') {
//           const values = Object.values(data).map(player => player[key]);
//           const filteredValues = values.filter(val => typeof val === 'number');
//           stats[key] = {
//               mean: ss.mean(filteredValues),
//               stdDev: ss.standardDeviation(filteredValues)
//           };
//       }
//   }
//   return stats;
// }
// // Função para adicionar os z-scores aos dados
// function addZScores(data, stats) {
//   for (const player in data) {
//       const playerData = data[player];
//       for (const season in playerData.Seasons) {
//           const seasonData = playerData.Seasons[season].Teams;
//           for (const team in seasonData) {
//               const teamData = seasonData[team];
//               for (const key in teamData) {
//                   const value = teamData[key];
//                   if (typeof value === 'number') {
//                       const statsForKey = stats[key];
//                       if (statsForKey) { // Verificar se as estatísticas existem
//                           const mean = statsForKey.mean;
//                           const stdDev = statsForKey.stdDev;
//                           const zScore = (value - mean) / stdDev;
//                           teamData[key + '_zScore'] = zScore;
//                       } else {
//                           console.error(`Estatísticas para '${key}' não foram encontradas.`);
//                       }
//                   }
//               }
//           }
//       }
//   }
//   return data;
// }
// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsNumerical.json');
// const data = JSON.parse(jsonData);

// // Calcular a média e o desvio padrão para cada atributo numérico
// const stats = calculateStats(data);

// // Adicionar Z-scores aos dados
// const dataWithZScores = addZScores(data, stats);

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync('playerStatsWithZScores.json', JSON.stringify(dataWithZScores, null, 2));

// console.log('Z-scores adicionados com sucesso!');





// // const fs = require('fs');
// // const { zScore } = require('simple-statistics');

// // // Função para calcular o Z-score e adicionar ao objeto de dados
// // function addZScores(data) {
// //     for (const player in data) {
// //         const playerData = data[player];
// //         for (const season in playerData.Seasons) {
// //             const seasonData = playerData.Seasons[season].Teams;
// //             for (const team in seasonData) {
// //                 const teamData = seasonData[team];
// //                 for (const key in teamData) {
// //                     const value = teamData[key];
// //                     if (typeof value === 'number') {
// //                         const z = zScore([value], [value]);
// //                         teamData[`${key}_zScore`] = z[0];
// //                     }
// //                 }
// //             }
// //         }
// //     }
// //     return data;
// // }

// // // Ler os dados do arquivo JSON
// // const jsonData = fs.readFileSync('playerStatsNumerical.json');
// // const data = JSON.parse(jsonData);

// // // Adicionar Z-scores aos dados
// // const dataWithZScores = addZScores(data);

// // // Salvar os dados atualizados em um novo arquivo JSON
// // fs.writeFileSync('playerStatsWithZScores.json', JSON.stringify(dataWithZScores, null, 2));

// // console.log('Z-scores adicionados com sucesso!');








// const fs = require('fs');
// const ss = require('simple-statistics');

// // Função para escrever o objeto em um arquivo JSON
// function writeJSONFile(data, outputFile) {
//   try {
//     fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
//     console.log(`Arquivo JSON criado com sucesso: ${outputFile}`);
//   } catch (error) {
//     console.error(`Erro ao escrever o arquivo JSON: ${error}`);
//   }
// }

// // Ler o arquivo JSON playerStatsUnicos.json
// const playerStatsData = fs.readFileSync('playerStatsNumerical.json', 'utf8');
// const playerStatsNumerical = JSON.parse(playerStatsData);

// // Função para calcular os z-scores
// function calculateZScores(data) {
//   const stats = {};
//   for (const key in data) {
//     const values = Object.values(data[key]);
//     const zScores = ss.zScore(values);
//     stats[key] = zScores;
//   }
//   return stats;
// }

// // Calcular os z-scores para os dados numéricos
// const zScoreStats = calculateZScores(playerStatsNumerical)

// // Escrever os z-scores em um novo arquivo JSON
// writeJSONFile(zScoreStats, 'playerStatsUnicos_zscore2.JSON');

// // Função para normalizar os dados com Z-score usando simple-statistics
// function normalizeDataWithZScore(data) {
//   const statisticsToNormalize = ['Goals', 'Assists', 'Shots', 'ShotsOnTarget', 'npxG', 'shots_on_target_pct', 'shots_per90', 'goals_per_shot', 'xG_net', 'TotDist', 'PrgDist', 'xAG', 'xA', 'PassesCompleted', 'PassesToFThird', 'PPA', 'CrsPA', 'PrgP', 'touches_def_pen_area', 'touches_def_3rd', 'touches_mid_3rd', 'SCA90', 'GCA90', 'Tackles', 'TacklesW', 'TacklesWpct', 'TacklesL', 'TaclkesInterceptions', 'Clr', 'Recov', 'Won', 'Lost', 'Wonpct', 'Att3rd', 'Att_Pen_area', 'PrgCarry', 'CarriesFwd', 'CarriesIntoBox', 'Dispos', 'Recv', 'PrgRec'];

//   const normalizedData = {};

//   for (const key in data) {
//     const jogador = data[key];
//     const filteredStats = {};
//     let hasValidStats = false;

//     for (const stat of statisticsToNormalize) {
//       if (jogador.hasOwnProperty(stat) && jogador[stat] !== null && !isNaN(jogador[stat])) {
//         filteredStats[stat] = jogador[stat];
//         hasValidStats = true;
//       }
//     }

//     if (hasValidStats) {
//       const values = Object.values(filteredStats);
//       const mean = ss.mean(values);
//       const stdDev = ss.standardDeviation(values);

//       if (!isNaN(mean) && !isNaN(stdDev)) {
//         const normalizedJogador = {};
//         for (const stat of statisticsToNormalize) {
//           if (filteredStats.hasOwnProperty(stat)) {
//             const value = filteredStats[stat];
//             normalizedJogador[`${stat}_zscore`] = ss.zScore(value, mean, stdDev);
//           }
//         }
//         normalizedData[key] = normalizedJogador;
//       }
//     }
//   }

//   return normalizedData;
// }



// // Normalizar os dados com Z-score
// const normalizedData = normalizeDataWithZScore(playerStatsNumerical);

// // Escrever os dados normalizados em um novo arquivo JSON
// writeJSONFile(normalizedData, 'playerStatsUnicos_zscore_normalized.JSON');