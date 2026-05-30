






// const fs = require('fs');
// const ss = require('simple-statistics');

// // Constantes para as métricas
// const METRICAS = {
//   defesa: {
//     attributes: ['tackles_zScore', 'tackles_won_zScore', 'challenge_tackles_pct_zScore', 'tackles_interceptions_zScore', 'aerials_won_zScore', 'aerials_won_pct_zScore', 'ball_recoveries_zScore'],
//     name: 'Defesa'
//   },
//   ataque: {
//     attributes: ['gols_zScore', 'assists_zScore', 'shots_total_zScore', 'shots_on_target_zScore', 'shots_on_target_pct_zScore', 'shots_free_kicks_zScore', 'shots_on_target_per90_zScore'],
//     name: 'Ataque'
//   },
//   remate: {
//     attributes: ['passes_completed_zScore', 'passes_zScore', 'passes_pct_zScore', 'passes_progressive_distance_zScore', 'passes_completed_short_zScore', 'passes_completed_medium_zScore', 'passes_completed_long_zScore'],
//     name: 'Remate'
//   }
// };

// // Função para adicionar uma métrica aos dados
// function addMetrica(data, metrica) {
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         const attributes = METRICAS[metrica].attributes;
//         // Verificar se todos os atributos necessários têm valores válidos
//         if (attributes.every(attr => teamData[attr] !== null && !isNaN(teamData[attr]))) {
//           teamData[metrica] = attributes.reduce((sum, attr) => sum + teamData[attr], 0);
//           // Adicionar a métrica normalizada ao objeto do jogador
//           teamData[`${metrica}_normalized`] = null; // Inicializar como null para preencher depois
//         } else {
//           console.log(`Erro: Um ou mais valores necessários para o cálculo da métrica ${METRICAS[metrica].name} são inválidos para ${jogador}, temporada ${season}, time ${team}`);
//         }
//       }
//     }
//   }
//   return data;
// }


// // Função para normalizar uma métrica entre 0 e 1
// function normalizeMetrica(data, metrica) {
//   const metricaValues = [];
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         if (teamData[metrica] === null || isNaN(teamData[metrica])) {
//           console.log(`Erro: Valor de ${metrica} é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue;
//         }
//         metricaValues.push(teamData[metrica]);
//       }
//     }
//   }
//   const validMetricaValues = metricaValues.filter(value => !isNaN(value));
//   if (validMetricaValues.length === 0) {
//     console.log(`Erro: Nenhum valor de ${metrica} válido encontrado para normalização`);
//     return data;
//   }
//   const min = ss.min(validMetricaValues);
//   const max = ss.max(validMetricaValues);
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         if (teamData[metrica] === null || isNaN(teamData[metrica])) {
//           console.log(`Erro: Valor de ${metrica} é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue;
//         }
//         teamData[`${metrica}_normalized`] = (teamData[metrica] - min) / (max - min);
//       }
//     }
//   }
//   return data;
// }

// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsWithZScores.json');
// const data = JSON.parse(jsonData);

// // Adicionar e normalizar todas as métricas ao arquivo JSON
// for (const metrica in METRICAS) {
//   const dataWithMetrica = addMetrica(data, metrica);
//   const dataWithNormalizedMetrica = normalizeMetrica(dataWithMetrica, metrica);
// }

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync('playerStatsWithMetrics.json', JSON.stringify(data, null, 2));

// console.log(`As métricas foram adicionadas e normalizadas com sucesso no arquivo "playerStatsWithMetrics.json"!`);








// const fs = require('fs');
// const ss = require('simple-statistics');

// // Função para adicionar a métrica "defesa" aos dados
// function addDefesa(data) {
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         const { tackles_zScore, tackles_won_zScore, challenge_tackles_pct_zScore, tackles_interceptions_zScore, aerials_won_zScore, aerials_won_pct_zScore, ball_recoveries_zScore } = teamData;
//         if ([tackles_zScore, tackles_won_zScore, challenge_tackles_pct_zScore, tackles_interceptions_zScore, aerials_won_zScore, aerials_won_pct_zScore, ball_recoveries_zScore].some(value => value === null)) {
//           console.log(`Erro: Um ou mais valores necessários para o cálculo da defesa são inválidos para ${jogador}, temporada ${season}, time ${team}`);
//           continue;
//         }
//         teamData.defesa = tackles_zScore + tackles_won_zScore + challenge_tackles_pct_zScore + tackles_interceptions_zScore + aerials_won_zScore + aerials_won_pct_zScore + ball_recoveries_zScore;
//       }
//     }
//   }
//   return data;
// }

// // Função para normalizar a métrica "defesa" entre 0 e 1
// function normalizeDefesa(data) {
//   const defesaValues = [];
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         if (teamData.defesa === null || isNaN(teamData.defesa)) {
//           console.log(`Erro: Valor de defesa é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue;
//         }
//         defesaValues.push(teamData.defesa);
//       }
//     }
//   }
//   const validDefesaValues = defesaValues.filter(value => !isNaN(value));
//   if (validDefesaValues.length === 0) {
//     console.log(`Erro: Nenhum valor de defesa válido encontrado para normalização`);
//     return data;
//   }
//   const min = ss.min(validDefesaValues);
//   const max = ss.max(validDefesaValues);
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;
//       for (const team in teams) {
//         const teamData = teams[team];
//         if (teamData.defesa === null || isNaN(teamData.defesa)) {
//           console.log(`Erro: Valor de defesa é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue;
//         }
//         teamData.defesa_normalized = (teamData.defesa - min) / (max - min);
//       }
//     }
//   }
//   return data;
// }

// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsWithMetrics.json');
// const data = JSON.parse(jsonData);

// // Adicionar a métrica "defesa" aos dados
// const dataWithDefesa = addDefesa(data);

// // Normalizar a métrica "defesa" entre 0 e 1
// const dataWithNormalizedDefesa = normalizeDefesa(dataWithDefesa);

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync('playerStatsWithNormalizedDefesa.json', JSON.stringify(dataWithNormalizedDefesa, null, 2));

// console.log('A Métrica "defesa" normalizada com sucesso e salva no arquivo "playerStatsWithNormalizedDefesa.json"!');

// const fs = require('fs');
// const ss = require('simple-statistics');

// // Função para adicionar a métrica "defesa" aos dados
// function addDefesa(data) {
//   // Percorrer os jogadores
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Verificar se há valores null e pular se houver
//         if (
//           teamData.tackles_zScore === null ||
//           teamData.tackles_won_zScore === null ||
//           teamData.challenge_tackles_pct_zScore === null ||
//           teamData.tackles_interceptions_zScore === null ||
//           teamData.aerials_won_zScore === null ||
//           teamData.aerials_won_pct_zScore === null ||
//           teamData.ball_recoveries_zScore === null
//         ) {
//           console.log(`Erro: Um ou mais valores necessários para o cálculo da defesa são inválidos para ${jogador}, temporada ${season}, time ${team}`);
//           continue; // Pular para a próxima iteração do loop
//         }

//         // Calcular a métrica "defesa" para cada jogador
//         const defesa =
//           teamData.tackles_zScore +
//           teamData.tackles_won_zScore +
//           teamData.challenge_tackles_pct_zScore +
//           teamData.tackles_interceptions_zScore +
//           teamData.aerials_won_zScore +
//           teamData.aerials_won_pct_zScore +
//           teamData.ball_recoveries_zScore;

//         // Adicionar a métrica "defesa" ao objeto do jogador
//         teamData.defesa = defesa;
//       }
//     }
//   }

//   return data;
// }




// // Função para normalizar a métrica "defesa" entre 0 e 1
// function normalizeDefesa(data) {
//   const defesaValues = [];

//   // Obter os valores de "defesa" para todos os jogadores
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Verificar se o valor de "defesa" é null ou NaN e pular se for
//         if (teamData.defesa === null || isNaN(teamData.defesa)) {
//           console.log(`Erro: Valor de defesa é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue; // Pular para a próxima iteração do loop
//         }

//         // Adicionar o valor de "defesa" ao array
//         defesaValues.push(teamData.defesa);
//       }
//     }
//   }

//   // Filtrar valores nulos e NaN
//   const validDefesaValues = defesaValues.filter(value => !isNaN(value));

//   // Verificar se não há valores de defesa válidos para normalização
//   if (validDefesaValues.length === 0) {
//     console.log(`Erro: Nenhum valor de defesa válido encontrado para normalização`);
//     return data;
//   }

//   // Calcular o mínimo e o máximo dos valores de "defesa" válidos
//   const min = ss.min(validDefesaValues);
//   const max = ss.max(validDefesaValues);

//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Verificar se o valor de "defesa" é null ou NaN e pular se for
//         if (teamData.defesa === null || isNaN(teamData.defesa)) {
//           console.log(`Erro: Valor de defesa é null ou NaN para ${jogador}, temporada ${season}, time ${team}`);
//           continue; // Pular para a próxima iteração do loop
//         }

//         // Normalizar a métrica "defesa" entre 0 e 1
//         teamData.defesa_normalized = (teamData.defesa - min) / (max - min);
//       }
//     }
//   }

//   return data;
// }


// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsWithMetrics.json');
// const data = JSON.parse(jsonData);

// // Adicionar a métrica "defesa" aos dados
// const dataWithDefesa = addDefesa(data);

// // Normalizar a métrica "defesa" entre 0 e 1
// const dataWithNormalizedDefesa = normalizeDefesa(dataWithDefesa);

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync('playerStatsWithNormalizedDefesa.json', JSON.stringify(dataWithNormalizedDefesa, null, 2));

// console.log('A Métrica "defesa" normalizada com sucesso e salva no arquivo "playerStatsWithNormalizedDefesa.json"!');




// /** @format */

// const fs = require('fs');

// // Função para adicionar a métrica "defesa" aos dados
// function addDefesa(data) {
//   // Percorrer os jogadores
//   for (const jogador in data) {
//     const seasons = data[jogador].Seasons;

//     // Percorrer as temporadas do jogador
//     for (const season in seasons) {
//       const teams = seasons[season].Teams;

//       // Percorrer os times de cada temporada
//       for (const team in teams) {
//         const teamData = teams[team];

//         // Calcular a métrica "defesa" para cada jogador
//         const defesa =
//           teamData.tackles_zScore +
//           teamData.tackles_won_zScore +
//           teamData.challenge_tackles_pct_zScore +
//           teamData.tackles_interceptions_zScore +
//           teamData.aerials_won_zScore +
//           teamData.aerials_won_pct_zScore +
//           teamData.ball_recoveries_zScore;

//         // Adicionar a métrica "defesa" ao objeto do jogador
//         teamData.defesa = defesa;
//       }
//     }
//   }

//   return data;
// }

// // Ler os dados do arquivo JSON
// const jsonData = fs.readFileSync('playerStatsWithZScores.json');
// const data = JSON.parse(jsonData);

// // Adicionar a métrica "defesa" aos dados
// const dataWithDefesa = addDefesa(data);

// // Salvar os dados atualizados em um novo arquivo JSON
// fs.writeFileSync(
//   'playerStatsWithMetrics.json',
//   JSON.stringify(dataWithDefesa, null, 2),
// );

// console.log('Métrica "defesa" adicionada com sucesso!');

// const playerData = extractPlayerData(combinedData);

// function writePlayerDataToFile(playerData, outputFile) {
//   try {
//     fs.writeFileSync(outputFile, JSON.stringify(playerData, null, 2));
//     console.log(
//       `Arquivo JSON com os dados dos jogadores criado com sucesso: ${outputFile}`,
//     );
//   } catch (error) {
//     console.error(
//       `Erro ao escrever o arquivo JSON com os dados dos jogadores: ${error}`,
//     );
//   }
// }

// writePlayerDataToFile(playerData, 'playerData.json');





// function extractPlayerData(combinedData) {
  //   const playerData = {};
  //   for (const league in combinedData) {
  //     playerData[league] = {};
  //     for (const season in combinedData[league]) {
  //       playerData[league][season] = [];
  
  //       const categories = combinedData[league][season];
  //       const allPlayers = {};
  
  //       for (const category in categories) {
  //         const players = categories[category];
  //         for (const player of players) {
  //           const key = generateKey(player, league, season);
  //           if (!allPlayers[key]) {
  //             allPlayers[key] = {
  //               ...player,
  //               Data: {
  //                 Player: player.player,
  //                 BirthYear: player.birth_year,
  //                 Nationality: player.nationality,
  //                 Age: player.age ? parseInt(player.age.split('-')[0]) : 0,
  //                 Team: player.team,
  //                 Games: player.games,
  //                 GamesStarts: player.games_starts,
  //                 Minutes: player.minutes,
  //                 Minutes90s: player.minutes_90s,
  //                 Goals: player.goals,
  //                 Assists: player.assists,
  //                 Shots: player.shots,
  //                 ShotsOnTarget: player.shots_on_target,
  //                 shots_on_target_pct: player.shots_on_target_pct,
  //                 shots_per90: player.shots_per90,
  //                 shots_on_target_per90: player.shots_on_target_per90,
  //                 goals_per_shot: player.goals_per_shot,
  //                 goals_per_shot_on_target: player.goals_per_shot_on_target,
  //                 npxG: player.npxg,
  //                 npxG_per_shot: player.npxg_per_shot,
  //                 xG_net: player.xg_net,
  //                 npxG_net: player.npxg_net,
  //                 TotDist: player.passes_total_distance,
  //                 PrgDist: player.passes_progressive_distance,
  //                 xAG: player.xg_assist,
  //                 xA: player.pass_xa,
  //                 PassesCompleted: player.passes_completed,
  //                 PassesToFThird: player.passes_into_final_third,
  //                 PPA: player.passes_into_penalty_area,
  //                 CrsPA: player.crosses_into_penalty_area,
  //                 PrgP: player.progressive_passes,
  //                 touches_def_pen_area: player.touches_def_pen_area,
  //                 touches_def_3rd: player.touches_def_3rd,
  //                 touches_mid_3rd: player.touches_mid_3rd,
  //                 SCA90: player.sca_per90,
  //                 GCA90: player.gca_per90,
  //                 Tackles: player.tackles,
  //                 TacklesW: player.tackles_won,
  //                 TacklesWpct: player.challenge_tackles_pct,
  //                 TacklesL: player.challenges_lost,
  //                 TaclkesInterceptions: player.tackles_interceptions,
  //                 Clr: player.clearances,
  //                 Recov: player.ball_recoveries,
  //                 Won: player.aerials_won,
  //                 Lost: player.aerials_lost,
  //                 Wonpct: player.aerials_won_pct,
  //                 Att3rd: player.touches_att_3rd,
  //                 Att_Pen_area: player.touches_att_pen_area,
  //                 PrgCarry: player.progressive_carries,
  //                 CarriesFwd: player.carries_into_final_third,
  //                 CarriesIntoBox: player.carries_into_penalty_area,
  //                 Dispos: player.dispossessed,
  //                 Recv: player.passes_received,
  //                 PrgRec: player.progressive_passes_received,
  //               }
  //             };
  //             playerData[league][season].push(allPlayers[key]);
  //           }
  //           // Adiciona os dados da categoria ao objeto de Data
  //           Object.assign(allPlayers[key].Data, player.Data);
  //         }
  //       }
  //     }
  //   }
  //   return playerData;
  // }
  















function generateSimplePlayerData(combinedData) {
  const playerDataSimple = {};

  for (const league in combinedData) {
    for (const season in combinedData[league]) {
      const players = combinedData[league][season];
      // Verifica se players é um array
      if (!Array.isArray(players)) {
        console.error(
          `Os dados dos jogadores para a liga ${league} e temporada ${season} não são válidos.`,
        );
        continue; // Pula esta iteração e continua com a próxima
      }
      for (const player of players) {
        const playerKey = `${player.Player}-${player.BirthYear}-${player.Nationality}`;
        if (!playerDataSimple[playerKey]) {
          playerDataSimple[playerKey] = {
            Player: player.Player,
            BirthYear: player.BirthYear,
            Nationality: player.Nationality,
            Team: player.Team,
            Leagues: [], // Inicializa como um array vazio
          };
        }

        // Verifica se a liga já foi adicionada ao array de Leagues
        let leagueObj = playerDataSimple[playerKey].Leagues.find(
          (leagueObj) => leagueObj.League === league,
        );
        if (!leagueObj) {
          // Se a liga ainda não foi adicionada, cria um novo objeto de League com a propriedade League e um objeto vazio Data
          leagueObj = {
            League: league,
            Data: {}, // Inicializa como um objeto vazio
          };
          playerDataSimple[playerKey].Leagues.push(leagueObj);
        }

        // Adiciona os dados correspondentes à liga ao objeto de Data
        Object.assign(leagueObj.Data, player.Data);
      }
    }
  }

  return playerDataSimple;
}

const playerDataSimple = generateSimplePlayerData(playerData);
writeJSONFile(playerDataSimple, 'playerDataSimple.json');




// // Extrair os dados dos jogadores mantendo a estrutura original
// function extractPlayerData(combinedData) {
//   const playerData = {};
//   for (const league in combinedData) {
//     playerData[league] = {};
//     for (const season in combinedData[league]) {
//       playerData[league][season] = [];

//       const categories = combinedData[league][season];
//       const allPlayers = [];

//       for (const category in categories) {
//         const players = categories[category];
//         for (const player of players) {
//           const existingPlayer = allPlayers.find(
//             (p) =>
//               p.Player === player.player && p.BirthYear === player.birth_year,
//           );
//           if (existingPlayer) {
//             // Atualizar os dados existentes
//             Object.assign(existingPlayer.Data, player);
//           } else {
//             // Adicionar novo jogador
//             allPlayers.push({
              // Player: player.player,
              // BirthYear: player.birth_year,
              // Nationality: player.nationality,
              // Age: player.age ? parseInt(player.age.split('-')[0]) : 0,
              // Team: player.team,
              // Data: {
              //   Games: player.games,
              //   GamesStarts: player.games_starts,
              //   Minutes: player.minutes,
              //   Minutes90s: player.minutes_90s,
              //   Goals: player.goals,
              //   Assists: player.assists,
              //   Shots: player.shots,
              //   ShotsOnTarget: player.shots_on_target,
              //   shots_on_target_pct: player.shots_on_target_pct,
              //   shots_per90: player.shots_per90,
              //   shots_on_target_per90: player.shots_on_target_per90,
              //   goals_per_shot: player.goals_per_shot,
              //   goals_per_shot_on_target: player.goals_per_shot_on_target,
              //   npxG: player.npxg,
              //   npxG_per_shot: player.npxg_per_shot,
              //   xG_net: player.xg_net,
              //   npxG_net: player.npxg_net,
              //   TotDist: player.passes_total_distance,
              //   PrgDist: player.passes_progressive_distance,
              //   xAG: player.xg_assist,
              //   xA: player.pass_xa,
              //   PassesCompleted: player.passes_completed,
              //   PassesToFThird: player.passes_into_final_third,
              //   PPA: player.passes_into_penalty_area,
              //   CrsPA: player.crosses_into_penalty_area,
              //   PrgP: player.progressive_passes,
              //   touches_def_pen_area: player.touches_def_pen_area,
              //   touches_def_3rd: player.touches_def_3rd,
              //   touches_mid_3rd: player.touches_mid_3rd,
              //   SCA90: player.sca_per90,
              //   GCA90: player.gca_per90,
              //   Tackles: player.tackles,
              //   TacklesW: player.tackles_won,
              //   TacklesWpct: player.challenge_tackles_pct,
              //   TacklesL: player.challenges_lost,
              //   TaclkesInterceptions: player.tackles_interceptions,
              //   Clr: player.clearances,
              //   Recov: player.ball_recoveries,
              //   Won: player.aerials_won,
              //   Lost: player.aerials_lost,
              //   Wonpct: player.aerials_won_pct,
              //   Att3rd: player.touches_att_3rd,
              //   Att_Pen_area: player.touches_att_pen_area,
              //   PrgCarry: player.progressive_carries,
              //   CarriesFwd: player.carries_into_final_third,
              //   CarriesIntoBox: player.carries_into_penalty_area,
              //   Dispos: player.dispossessed,
              //   Recv: player.passes_received,
              //   PrgRec: player.progressive_passes_received,
              // },
//             });
//           }
//         }
//       }

//       playerData[league][season] = allPlayers;
//     }
//   }
//   return playerData;
// }



// function generateSimplePlayerData(combinedData) {
//   const playerDataSimple = {};

//   for (const league in combinedData) {
//     for (const season in combinedData[league]) {
//       const players = combinedData[league][season];
//       // Verifica se players é um array
//       if (!Array.isArray(players)) {
//         console.error(`Os dados dos jogadores para a liga ${league} e temporada ${season} não são válidos.`);
//         continue; // Pula esta iteração e continua com a próxima
//       }
//       for (const player of players) {
//         const playerKey = `${player.Player}-${player.BirthYear}-${player.Nationality}`;
//         if (!playerDataSimple[playerKey]) {
//           playerDataSimple[playerKey] = {
//             Player: player.Player,
//             BirthYear: player.BirthYear,
//             Nationality: player.Nationality,
//             Leagues: []
//           };
//         }
//         playerDataSimple[playerKey].Leagues.push({
//           League: league,
//           Data: {
//             Games: player.Data.Games,
//             GamesStarts: player.Data.GamesStarts,
//             Minutes: player.Data.Minutes,
//             Minutes90s: player.Data.Minutes90s,
//             Goals: player.Data.Goals,
//             Assists: player.Data.Assists,
//             Shots: player.Data.Shots,
//             ShotsOnTarget: player.Data.ShotsOnTarget,
//             shots_on_target_pct: player.Data.shots_on_target_pct,
//             shots_per90: player.Data.shots_per90,
//             shots_on_target_per90: player.Data.shots_on_target_per90,
//             goals_per_shot: player.Data.goals_per_shot,
//             goals_per_shot_on_target: player.Data.goals_per_shot_on_target,
//             npxG: player.Data.npxG,
//             npxG_per_shot: player.Data.npxG_per_shot,
//             xG_net: player.Data.xG_net,
//             npxG_net: player.Data.npxG_net,
//             TotDist: player.Data.TotDist,
//             PrgDist: player.Data.PrgDist,
//             xAG: player.Data.xAG,
//             xA: player.Data.xA,
//             PassesCompleted: player.Data.PassesCompleted,
//             PassesToFThird: player.Data.PassesToFThird,
//             PPA: player.Data.PPA,
//             CrsPA: player.Data.CrsPA,
//             PrgP: player.Data.PrgP,
//             touches_def_pen_area: player.Data.touches_def_pen_area,
//             touches_def_3rd: player.Data.touches_def_3rd,
//             touches_mid_3rd: player.Data.touches_mid_3rd,
//             SCA90: player.Data.SCA90,
//             GCA90: player.Data.GCA90,
//             Tackles: player.Data.Tackles,
//             TacklesW: player.Data.TacklesW,
//             TacklesWpct: player.Data.TacklesWpct,
//             TacklesL: player.Data.TacklesL,
//             TaclkesInterceptions: player.Data.TaclkesInterceptions,
//             Clr: player.Data.Clr,
//             Recov: player.Data.Recov,
//             Won: player.Data.Won,
//             Lost: player.Data.Lost,
//             Wonpct: player.Data.Wonpct,
//             Att3rd: player.Data.Att3rd,
//             Att_Pen_area: player.Data.Att_Pen_area,
//             PrgCarry: player.Data.PrgCarry,
//             CarriesFwd: player.Data.CarriesFwd,
//             CarriesIntoBox: player.Data.CarriesIntoBox,
//             Dispos: player.Data.Dispos,
//             Recv: player.Data.Recv,
//             PrgRec: player.Data.PrgRec
//           }
//         });
//       }
//     }
//   }

//   return playerDataSimple;
// }
// // Extrair os dados dos jogadores mantendo a estrutura original
// function extractPlayerData(combinedData) {
//   const playerData = {};
//   for (const league in combinedData) {
//     playerData[league] = {};
//     for (const season in combinedData[league]) {
//       playerData[league][season] = [];
//       const categories = combinedData[league][season];
//       for (const category in categories) {
//         const players = categories[category];
//         for (const player of players) {
//           // Extrair apenas as variáveis necessárias e adicionar aos dados do jogador
//           const extractedPlayerData = {
//             Player: player.player,
//             Season: player.season,
//             League: player.league,
//             Nationality: player.nationality,
//             Age: player.age ? parseInt(player.age.split('-')[0]) : 0,
//             BirthYear: player.birth_year,
//             Games: player.games,
//             GamesStarts: player.games_starts,
//             Minutes: player.minutes,
//             Minutes90s: player.minutes_90s,
//             Goals: player.goals,
//             Assists: player.assists,
//             Shots: player.shots,
//             ShotsOnTarget: player.shots_on_target,
//             shots_on_target_pct: player.shots_on_target_pct,
//             shots_per90: player.shots_per90,
//             shots_on_target_per90: player.shots_on_target_per90,
//             goals_per_shot: player.goals_per_shot,
//             goals_per_shot_on_target: player.goals_per_shot_on_target,
//             npxG: player.npxg,
//             npxG_per_shot: player.npxg_per_shot,
//             xG_net: player.xg_net,
//             npxG_net: player.npxg_net,
//             TotDist: player.passes_total_distance,
//             PrgDist: player.passes_progressive_distance,
//             xAG: player.xg_assist,
//             xA: player.pass_xa,
//             PassesCompleted: player.passes_completed,
//             PassesToFThird: player.passes_into_final_third,
//             PPA: player.passes_into_penalty_area,
//             CrsPA: player.crosses_into_penalty_area,
//             PrgP: player.progressive_passes,
//             touches_def_pen_area: player.touches_def_pen_area,
//             touches_def_3rd: player.touches_def_3rd,
//             touches_mid_3rd: player.touches_mid_3rd,
//             SCA90: player.sca_per90,
//             GCA90: player.gca_per90,
//             Tackles: player.tackles,
//             TacklesW: player.tackles_won,
//             TacklesWpct: player.challenge_tackles_pct,
//             TacklesL: player.challenges_lost,
//             TaclkesInterceptions: player.tackles_interceptions,
//             Clr: player.clearances,
//             Recov: player.ball_recoveries,
//             Won: player.aerials_won,
//             Lost: player.aerials_lost,
//             Wonpct: player.aerials_won_pct,
//             Att3rd: player.touches_att_3rd,
//             Att_Pen_area: player.touches_att_pen_area,
//             TotDist: player.passes_total_distance,
//             PrgDist: player.passes_progressive_distance,
//             PrgCarry: player.progressive_carries,
//             CarriesFwd: player.carries_into_final_third,
//             CarriesIntoBox: player.carries_into_penalty_area,
//             Dispos: player.dispossessed,
//             Recv: player.passes_received,
//             PrgRec: player.progressive_passes_received
//           };
//           playerData[league][season].push(extractedPlayerData);
//         }
//       }
//     }
//   }
//   return playerData;
// }









































// const fs = require('fs');
// const path = require('path');

// function generateFiles(seasons, league, competitionId, categories) {
//   const baseDirectory = 'data';
//   const files = [];

//   for (const season of seasons) {
//     for (const category of categories) {
//       const fileName = path.join(baseDirectory, `${competitionId}-${league}`, season, category, `${season}-${league}-${category}.json`);
//       files.push(fileName);
//     }
//   }

//   return files;
// }
// // Função para verificar se o arquivo existe
// function fileExists(filePath) {
//   try {
//     fs.accessSync(filePath, fs.constants.F_OK);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// // Função para extrair o nome da liga do caminho do arquivo
// function extractLeagueName(filePath) {
//   // Divida o caminho do arquivo usando o separador de diretório
//   const parts = filePath.split(path.sep);
//   // O nome da liga pode ser obtido a partir do índice que você determinou
//   // neste caso, vamos supor que o nome da liga é o segundo elemento antes do último
//   return parts[parts.length - 3];
// }

// // Função para extrair a temporada do caminho do arquivo
// function extractSeason(filePath) {
//   // Divida o caminho do arquivo usando o separador de diretório
//   const parts = filePath.split(path.sep);
//   // A temporada pode ser obtida a partir do índice que você determinou
//   // neste caso, vamos supor que a temporada é o último elemento da matriz dividida
//   const fileName = parts[parts.length - 1];
//   // Extraia a temporada do nome do arquivo removendo a extensão '.json'
//   return fileName.replace('.json', '');
// }


// // Liga da Serie A do Brasil
// const serieASeasons = [
//   '2019',
//   '2020',
//   '2021',
//   '2022',
//   '2023'
// ];

// const serieALeague = 'Serie-A';
// const serieACompetitionId = '24';

// const serieACategories = [
//   'standard',
//   'shooting',
//   'passing',
//   'gca',
//   'defense',
//   'possession',
//   'misc'
// ];

// const serieAFiles = generateFiles(serieASeasons, serieALeague, serieACompetitionId, serieACategories);

// // Liga "European Leagues"
// const europeanLeaguesSeasons = [
//   '2017-2018'
// ];

// const europeanLeaguesLeague = 'European Leagues';
// const europeanLeaguesCompetitionId = 'Big5';

// const europeanLeaguesCategories = [
//   'standard',
//   'shooting',
//   'passing',
//   'gca',
//   'defense',
//   'possession',
//   'misc'
// ];

// const europeanLeaguesFiles = generateFiles(europeanLeaguesSeasons, europeanLeaguesLeague, europeanLeaguesCompetitionId, europeanLeaguesCategories);

// // Liga Primeira-Liga, Eredivisie, European Leagues
// const leagues = [
//   { name: 'Primeira-Liga', id: '32', seasons: ['2018-2019','2019-2020','2020-2021','2021-2022','2022-2023'] },
//   { name: 'Eredivisie', id: '23', seasons: ['2018-2019','2019-2020','2020-2021','2021-2022','2022-2023'] },
//   { name: 'European Leagues', id: 'Big5', seasons: ['2017-2018', '2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023'] }, // Adicione as temporadas corretas aqui
//   {name: 'Serie-A', id: '24', seasons: ['2019','2020','2021','2022','2023']}
// ];

// const combinedFiles = [];

// for (const league of leagues) {
//   const leagueFiles = generateFiles(league.seasons || serieASeasons, league.name, league.id, serieACategories); // Use as temporadas corretas aqui
//   combinedFiles.push(...leagueFiles);
// }

// // Exibir os arquivos gerados
// combinedFiles.forEach(filePath => console.log(filePath));

// // Função para ler o conteúdo de um arquivo JSON
// function readJSONFile(filePath) {
//   try {
//     if (fileExists(filePath)) {
//       const data = fs.readFileSync(filePath, 'utf8');
//       return JSON.parse(data);
//     } else {
//       console.error(`O arquivo ${filePath} não existe.`);
//       return null;
//     }
//   } catch (error) {
//     console.error(`Erro ao ler o arquivo ${filePath}: ${error}`);
//     return null;
//   }
// }

// // Função para combinar os dados de vários arquivos JSON
// function combineJSONFiles(filePaths) {
//   const combinedData = [];
//   for (const filePath of filePaths) {
//     const data = readJSONFile(filePath);
//     if (data) {
//       // Adiciona informações da liga e temporada aos dados combinados
//       const leagueName = extractLeagueName(filePath);
//       const season = extractSeason(filePath);
//       const combinedItem = { league: leagueName, season: season, data: data };
//       combinedData.push(combinedItem);
//     }
//   }
//   return combinedData;
// }

// // Função para combinar os dados de vários arquivos JSON
// function combineJSONFiles(filePaths) {
//   const combinedData = [];
//   for (const filePath of filePaths) {
//     const data = readJSONFile(filePath);
//     if (data) {
//       const leagueName = extractLeagueName(filePath);
//       const season = extractSeason(filePath);
//       combinedData.push({ league: leagueName, season: season, data: data });
//     }
//   }
//   return combinedData;
// }

// // Função para escrever os dados combinados em um novo arquivo JSON
// function writeJSONFile(data, outputFile) {
//   try {
//     const leagueData = {};

//     // Agrupar os dados por liga e temporada
//     for (const item of data) {
//       const leagueName = item.league;
//       const season = item.season;
//       const playersData = item.data;

//       if (!leagueData[leagueName]) {
//         leagueData[leagueName] = {};
//       }

//       if (!leagueData[leagueName][season]) {
//         leagueData[leagueName][season] = [];
//       }

//       leagueData[leagueName][season] = leagueData[leagueName][season].concat(playersData);
//     }

//     const jsonData = JSON.stringify(leagueData, null, 2);
//     fs.writeFileSync(outputFile, jsonData);
//     console.log(`Arquivo JSON criado com sucesso: ${outputFile}`);

//     // Exibir a estrutura do arquivo gerado
//     console.log("Estrutura do arquivo gerado:");
//     // console.log(jsonData);
//   } catch (error) {
//     console.error(`Erro ao escrever o arquivo JSON: ${error}`);
//   }
// }


// // Obter os caminhos dos arquivos JSON que deseja combinar
// const jsonFiles = combinedFiles;

// // Combina os dados dos arquivos JSON
// const combinedData = combineJSONFiles(jsonFiles);

// // Escreve os dados combinados em um novo arquivo JSON
// writeJSONFile(combinedData, 'combinedData.json');