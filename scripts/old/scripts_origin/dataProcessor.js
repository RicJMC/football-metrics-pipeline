
const fs = require('fs');
const { promisify } = require('util');
const _ = require('lodash');
const ss = require('simple-statistics');

console.log("inicio")

// Lista de arquivos JSON
const files = [
    'data/32-Primeira-Liga/2023-2024/defense/2023-2024-Primeira-Liga-defense.json',
    'data/32-Primeira-Liga/2023-2024/gca/2023-2024-Primeira-Liga-gca.json',
    'data/32-Primeira-Liga/2023-2024/misc/2023-2024-Primeira-Liga-misc.json',
    'data/32-Primeira-Liga/2023-2024/passing/2023-2024-Primeira-Liga-passing.json',
    'data/32-Primeira-Liga/2023-2024/possession/2023-2024-Primeira-Liga-possession.json',
    'data/32-Primeira-Liga/2023-2024/standard/2023-2024-Primeira-Liga-standard.json',
    'data/32-Primeira-Liga/2023-2024/shooting/2023-2024-Primeira-Liga-shooting.json',
];

// Função para extrair informações do nome do arquivo
function extractFileInfo(filename) {
  const regex = /(\d{4}-\d{4})-(\d+-\w+)\.json/;
  const match = filename.match(regex);
  if (match) {
    return { season: match[1], league: match[2] };
  } else {
    return null;
  }
}

// Função para ler e combinar os dados de um arquivo JSON
function readAndCombineData(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const jsonData = JSON.parse(data);
    const fileInfo = extractFileInfo(filename);
    const filteredData = jsonData.filter(obj => 'player' in obj);
    if (fileInfo) {
      filteredData.forEach(obj => {
        obj.season = fileInfo.season;
        obj.league = fileInfo.league;
        // Remova a seguinte linha, pois a categoria não está presente no nome do arquivo
        // obj.competitionId = fileInfo.year;
        // obj.category = fileInfo.category;
      });
    }
    return filteredData;
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filename}: ${error.message}`);
    return [];
  }
}

// Função para agregar dados combinados
async function aggregateData(data) {
  const aggregatedData = {};
  data.forEach(obj => {
      const key = obj.player;
      if (!aggregatedData[key]) {
          aggregatedData[key] = obj;
      } else {
          Object.assign(aggregatedData[key], obj);
      }
  });
  return Object.values(aggregatedData);
}

// Função principal assíncrona
async function main() {
  let allData = [];
  for (const filename of files) {
      const jsonData = await readAndCombineData(filename);
      allData = allData.concat(jsonData);
  }
  allData = await aggregateData(allData);

  console.log(`Total de jogadores encontrados: ${allData.length}`);

  // Aqui você pode realizar o tratamento e consulta dos dados conforme necessário

  const selectedData  = allData.map(jogador => ({
    Player: jogador.player,
    Season: jogador.season,
    League: jogador.league,
    Nationality: jogador.nationality,
    Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0,
    BirthYear: jogador.birth_year,
    Games: jogador.games,
    GamesStarts: jogador.games_starts,
    Minutes: jogador.minutes,
    Minutes90s: jogador.minutes_90s,
    Goals: jogador.goals,
    Assists: jogador.assists,
    Shots: jogador.shots,
    ShotsOnTarget: jogador.shots_on_target,
    shots_on_target_pct: jogador.shots_on_target_pct,
    shots_per90: jogador.shots_per90,
    shots_on_target_per90: jogador.shots_on_target_per90,
    goals_per_shot: jogador.goals_per_shot,
    goals_per_shot_on_target: jogador.goals_per_shot_on_target,
    npxG: jogador.npxg,
    npxG_per_shot: jogador.npxg_per_shot,
    xG_net: jogador.xg_net,
    npxG_net: jogador.npxg_net,
    TotDist: jogador.passes_total_distance,
    PrgDist: jogador.passes_progressive_distance,
    xAG: jogador.xg_assist,
    xA: jogador.pass_xa,
    PassesCompleted: jogador.passes_completed,
    PassesToFThird: jogador.passes_into_final_third,
    PPA: jogador.passes_into_penalty_area,
    CrsPA: jogador.crosses_into_penalty_area,
    PrgP: jogador.progressive_passes,
    touches_def_pen_area: jogador.touches_def_pen_area,
    touches_def_3rd: jogador.touches_def_3rd,
    touches_mid_3rd: jogador.touches_mid_3rd,
    SCA90: jogador.sca_per90,
    GCA90: jogador.gca_per90,
    Tackles: jogador.tackles,
    TacklesW: jogador.tackles_won,
    TacklesWpct: jogador.challenge_tackles_pct,
    TacklesL: jogador.challenges_lost,
    TaclkesInterceptions: jogador.tackles_interceptions,
    Clr: jogador.clearances,
    Recov: jogador.ball_recoveries,
    Won: jogador.aerials_won,
    Lost: jogador.aerials_lost,
    Wonpct: jogador.aerials_won_pct,
    Att3rd: jogador.touches_att_3rd,
    Att_Pen_area: jogador.touches_att_pen_area,
    TotDist: jogador.passes_total_distance,
    PrgDist: jogador.passes_progressive_distance,
    PrgCarry: jogador.progressive_carries,
    CarriesFwd: jogador.carries_into_final_third,
    CarriesIntoBox: jogador.carries_into_penalty_area,
    Dispos: jogador.dispossessed,
    Recv: jogador.passes_received,
    PrgRec: jogador.progressive_passes_received
  }));

  console.log(`Total de jogadores selecionados: ${selectedData.length}`);


  // Normalizar os dados com Z-score
  const normalizedData = await normalizeDataWithZScore(selectedData.map(jogador => {
    // Converter os valores do jogador para números, se possível
    return convertValuesToNumbers(jogador);
  }));

    console.log(`Total de jogadores normalizados: ${normalizedData.length}`);

  // Adicionando a nova métrica "Remate" e "Defesa" já com Z-score calculado e normalizados entre 0 e 1
  const dataWithMetrics = normalizedData.map(jogador => ({
    ...jogador,
    Remate: jogador.Goals_zscore + jogador.Assists_zscore + jogador.Shots_zscore + jogador.ShotsOnTarget_zscore + jogador.npxG_zscore + jogador.shots_on_target_pct_zscore + jogador.shots_per90_zscore + jogador.goals_per_shot_zscore + jogador.xG_net_zscore + jogador.TotDist_zscore + jogador.PrgDist_zscore + jogador.xAG_zscore + jogador.xA_zscore + jogador.PassesCompleted_zscore + jogador.PassesToFThird_zscore + jogador.PPA_zscore + jogador.CrsPA_zscore + jogador.PrgP_zscore + jogador.touches_def_pen_area_zscore + jogador.touches_def_3rd_zscore + jogador.touches_mid_3rd_zscore + jogador.SCA90_zscore + jogador.GCA90_zscore,
    Defesa: jogador.Tackles_zscore + jogador.TacklesW_zscore + jogador.TacklesWpct_zscore + jogador.TacklesL_zscore + jogador.TaclkesInterceptions_zscore + jogador.Clr_zscore + jogador.Recov_zscore + jogador.Won_zscore + jogador.Lost_zscore
  }));

  // Normalizar os dados com Min-Max
  const dataWithNormalizedMetrics = normalizeDataWithMinMax(dataWithMetrics);

  console.log(`Total de jogadores normalizados com métricas adicionais: ${dataWithNormalizedMetrics.length}`);

  

  // Converter para CSV
  const csvData = dataWithNormalizedMetrics.map(jogador => Object.values(jogador).join(',')).join('\n');
  await fs.promises.writeFile('PT23-24.csv', csvData); // Usando fs.promises.writeFile

  console.log(`CSV gerado com sucesso.`);


  // Converter para JSON
  const jsonDataString = JSON.stringify(dataWithNormalizedMetrics, null, 2);
  await fs.promises.writeFile('PT23-24.json', jsonDataString); // Usando fs.promises.writeFile

  console.log(`JSON gerado com sucesso.`);


  console.log("fim");
}

// Chamar a função principal
main().catch(error => console.error(`Erro no programa: ${error}`));

// Função para normalizar os dados com Z-score usando simple-statistics
async function normalizeDataWithZScore(data) {
  const statisticsToNormalize = ['Goals', 'Assists', 'Shots', 'ShotsOnTarget', 'npxG', 'shots_on_target_pct', 'shots_per90', 'goals_per_shot', 'xG_net', 'TotDist', 'PrgDist', 'xAG', 'xA', 'PassesCompleted', 'PassesToFThird', 'PPA', 'CrsPA', 'PrgP', 'touches_def_pen_area', 'touches_def_3rd', 'touches_mid_3rd', 'SCA90', 'GCA90', 'Tackles', 'TacklesW', 'TacklesWpct', 'TacklesL', 'TaclkesInterceptions', 'Clr', 'Recov', 'Won', 'Lost', 'Wonpct', 'Att3rd', 'Att_Pen_area', 'PrgCarry', 'CarriesFwd', 'CarriesIntoBox', 'Dispos', 'Recv', 'PrgRec'];

  const filteredData = data.filter(jogador => statisticsToNormalize.every(stat => jogador[stat] !== null && !isNaN(jogador[stat])));


  const normalizedData = filteredData.map(jogador => {
      const normalizedJogador = { ...jogador };
      for (const stat of statisticsToNormalize) {
        const values = filteredData.map(j => j[stat]); // Use os dados filtrados aqui
        const mean = ss.mean(values);
          const stdDev = ss.standardDeviation(values);
          const value = jogador[stat];
          normalizedJogador[`${stat}_zscore`] = ss.zScore(value, mean, stdDev);
      }
      return normalizedJogador;
  });

  return normalizedData;
}

// Função para converter os valores de um objeto para números, se possível
function convertValuesToNumbers(obj) {
  const convertedObj = {};
  for (const [key, value] of Object.entries(obj)) {
      convertedObj[key] = isNaN(value) ? value : parseFloat(value);
  }
  return convertedObj;
}



// Função para normalizar os dados com Min-Max
function normalizeDataWithMinMax(data) {
  const statisticsToNormalize = ['Remate', 'Defesa']; // Adicione 'Remate' e 'Defesa' à lista de métricas

  const normalizedData = data.map(jogador => {
      const normalizedJogador = { ...jogador };
      const values = {}; // Defina values fora do loop
      for (const stat of statisticsToNormalize) {
          values[stat] = data.map(j => j[stat]);
          const minValue = Math.min(...values[stat]);
          const maxValue = Math.max(...values[stat]);
          const value = jogador[stat];
          normalizedJogador[`${stat}_minmax`] = (value - minValue) / (maxValue - minValue);
      }
      // Adicione a métrica "Remate"
      normalizedJogador.Remate = normalizedJogador.Goals_zscore + normalizedJogador.Assists_zscore + normalizedJogador.Shots_zscore + normalizedJogador.ShotsOnTarget_zscore + normalizedJogador.npxG_zscore + normalizedJogador.shots_on_target_pct_zscore + normalizedJogador.shots_per90_zscore + normalizedJogador.goals_per_shot_zscore + normalizedJogador.xG_net_zscore + normalizedJogador.TotDist_zscore + normalizedJogador.PrgDist_zscore + normalizedJogador.xAG_zscore + normalizedJogador.xA_zscore + normalizedJogador.PassesCompleted_zscore + normalizedJogador.PassesToFThird_zscore + normalizedJogador.PPA_zscore + normalizedJogador.CrsPA_zscore + normalizedJogador.PrgP_zscore + normalizedJogador.touches_def_pen_area_zscore + normalizedJogador.touches_def_3rd_zscore + normalizedJogador.touches_mid_3rd_zscore + normalizedJogador.SCA90_zscore + normalizedJogador.GCA90_zscore;
      // Adicione a métrica "Remate_minmax"
      normalizedJogador.Remate_minmax = (normalizedJogador.Remate - Math.min(...values['Remate'])) / (Math.max(...values['Remate']) - Math.min(...values['Remate']));
      return normalizedJogador;
  });

  return normalizedData;
}



































































// const fs = require('fs');
// const { promisify } = require('util');
// const _ = require('lodash');
// const ss = require('simple-statistics');

// console.log("inicio")

// // Lista de arquivos JSON
// const files = [
//     'data/32-Primeira-Liga/2023-2024/defense/2023-2024-Primeira-Liga-defense.json',
//     'data/32-Primeira-Liga/2023-2024/gca/2023-2024-Primeira-Liga-gca.json',
//     'data/32-Primeira-Liga/2023-2024/misc/2023-2024-Primeira-Liga-misc.json',
//     'data/32-Primeira-Liga/2023-2024/passing/2023-2024-Primeira-Liga-passing.json',
//     'data/32-Primeira-Liga/2023-2024/possession/2023-2024-Primeira-Liga-possession.json',
//     'data/32-Primeira-Liga/2023-2024/standard/2023-2024-Primeira-Liga-standard.json',
//     'data/32-Primeira-Liga/2023-2024/shooting/2023-2024-Primeira-Liga-shooting.json',
// ];

// // Função para ler e combinar os dados de um arquivo JSON
// // Função para ler e combinar os dados de um arquivo JSON
// async function readAndCombineData(filename) {
//   try {
//       const data = await fs.promises.readFile(filename, 'utf8'); // Use fs.promises.readFile para operações assíncronas
//       const jsonData = JSON.parse(data);
//       return jsonData.filter(obj => 'player' in obj);
//   } catch (error) {
//       console.error(`Erro ao ler o arquivo ${filename}: ${error.message}`);
//       return [];
//   }
// }

// // Função para agregar dados combinados
// async function aggregateData(data) {
//   const aggregatedData = {};
//   data.forEach(obj => {
//       const key = obj.player;
//       if (!aggregatedData[key]) {
//           aggregatedData[key] = obj;
//       } else {
//           Object.assign(aggregatedData[key], obj);
//       }
//   });
//   return Object.values(aggregatedData);
// }

// // Função principal assíncrona
// async function main() {
//   let allData = [];
//   for (const filename of files) {
//       const jsonData = await readAndCombineData(filename);
//       allData = allData.concat(jsonData);
//   }
//   allData = await aggregateData(allData);

//   console.log(`Total de jogadores encontrados: ${allData.length}`);

//   // Aqui você pode realizar o tratamento e consulta dos dados conforme necessário

//   const selectedData  = allData.map(jogador => ({
//     Player: jogador.player,
//     Nationality: jogador.nationality,
//     Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0,
//     BirthYear: jogador.birth_year,
//     Games: jogador.games,
//     GamesStarts: jogador.games_starts,
//     Minutes: jogador.minutes,
//     Minutes90s: jogador.minutes_90s,
//     Goals: jogador.goals,
//     Assists: jogador.assists,
//     Shots: jogador.shots,
//     ShotsOnTarget: jogador.shots_on_target,
//     shots_on_target_pct: jogador.shots_on_target_pct,
//     shots_per90: jogador.shots_per90,
//     shots_on_target_per90: jogador.shots_on_target_per90,
//     goals_per_shot: jogador.goals_per_shot,
//     goals_per_shot_on_target: jogador.goals_per_shot_on_target,
//     npxG: jogador.npxg,
//     npxG_per_shot: jogador.npxg_per_shot,
//     xG_net: jogador.xg_net,
//     npxG_net: jogador.npxg_net,
//     TotDist: jogador.passes_total_distance,
//     PrgDist: jogador.passes_progressive_distance,
//     xAG: jogador.xg_assist,
//     xA: jogador.pass_xa,
//     PassesCompleted: jogador.passes_completed,
//     PassesToFThird: jogador.passes_into_final_third,
//     PPA: jogador.passes_into_penalty_area,
//     CrsPA: jogador.crosses_into_penalty_area,
//     PrgP: jogador.progressive_passes,
//     touches_def_pen_area: jogador.touches_def_pen_area,
//     touches_def_3rd: jogador.touches_def_3rd,
//     touches_mid_3rd: jogador.touches_mid_3rd,
//     SCA90: jogador.sca_per90,
//     GCA90: jogador.gca_per90,
//     Tackles: jogador.tackles,
//     TacklesW: jogador.tackles_won,
//     TacklesWpct: jogador.challenge_tackles_pct,
//     TacklesL: jogador.challenges_lost,
//     TaclkesInterceptions: jogador.tackles_interceptions,
//     Clr: jogador.clearances,
//     Recov: jogador.ball_recoveries,
//     Won: jogador.aerials_won,
//     Lost: jogador.aerials_lost,
//     Wonpct: jogador.aerials_won_pct,
//     Att3rd: jogador.touches_att_3rd,
//     Att_Pen_area: jogador.touches_att_pen_area,
//     TotDist: jogador.passes_total_distance,
//     PrgDist: jogador.passes_progressive_distance,
//     PrgCarry: jogador.progressive_carries,
//     CarriesFwd: jogador.carries_into_final_third,
//     CarriesIntoBox: jogador.carries_into_penalty_area,
//     Dispos: jogador.dispossessed,
//     Recv: jogador.passes_received,
//     PrgRec: jogador.progressive_passes_received
//   }));

//   console.log(`Total de jogadores selecionados: ${selectedData.length}`);


//   // Normalizar os dados com Z-score
//   const normalizedData = await normalizeDataWithZScore(selectedData.map(jogador => {
//     // Converter os valores do jogador para números, se possível
//     return convertValuesToNumbers(jogador);
//   }));

//     console.log(`Total de jogadores normalizados: ${normalizedData.length}`);

//   // Adicionando a nova métrica "Remate" e "Defesa" já com Z-score calculado e normalizados entre 0 e 1
//   const dataWithMetrics = normalizedData.map(jogador => ({
//     ...jogador,
//     Remate: jogador.Goals_zscore + jogador.Assists_zscore + jogador.Shots_zscore + jogador.ShotsOnTarget_zscore + jogador.npxG_zscore + jogador.shots_on_target_pct_zscore + jogador.shots_per90_zscore + jogador.goals_per_shot_zscore + jogador.xG_net_zscore + jogador.TotDist_zscore + jogador.PrgDist_zscore + jogador.xAG_zscore + jogador.xA_zscore + jogador.PassesCompleted_zscore + jogador.PassesToFThird_zscore + jogador.PPA_zscore + jogador.CrsPA_zscore + jogador.PrgP_zscore + jogador.touches_def_pen_area_zscore + jogador.touches_def_3rd_zscore + jogador.touches_mid_3rd_zscore + jogador.SCA90_zscore + jogador.GCA90_zscore,
//     Defesa: jogador.Tackles_zscore + jogador.TacklesW_zscore + jogador.TacklesWpct_zscore + jogador.TacklesL_zscore + jogador.TaclkesInterceptions_zscore + jogador.Clr_zscore + jogador.Recov_zscore + jogador.Won_zscore + jogador.Lost_zscore
//   }));

//   // Normalizar os dados com Min-Max
//   const dataWithNormalizedMetrics = normalizeDataWithMinMax(dataWithMetrics);

//   console.log(`Total de jogadores normalizados com métricas adicionais: ${dataWithNormalizedMetrics.length}`);

  

//   // Converter para CSV
//   const csvData = dataWithNormalizedMetrics.map(jogador => Object.values(jogador).join(',')).join('\n');
//   await fs.promises.writeFile('PT23-24.csv', csvData); // Usando fs.promises.writeFile

//   console.log(`CSV gerado com sucesso.`);


//   // Converter para JSON
//   const jsonDataString = JSON.stringify(dataWithNormalizedMetrics, null, 2);
//   await fs.promises.writeFile('PT23-24.json', jsonDataString); // Usando fs.promises.writeFile

//   console.log(`JSON gerado com sucesso.`);


//   console.log("fim");
// }

// // Chamar a função principal
// main().catch(error => console.error(`Erro no programa: ${error}`));

// // Função para normalizar os dados com Z-score usando simple-statistics
// async function normalizeDataWithZScore(data) {
//   const statisticsToNormalize = ['Goals', 'Assists', 'Shots', 'ShotsOnTarget', 'npxG', 'shots_on_target_pct', 'shots_per90', 'goals_per_shot', 'xG_net', 'TotDist', 'PrgDist', 'xAG', 'xA', 'PassesCompleted', 'PassesToFThird', 'PPA', 'CrsPA', 'PrgP', 'touches_def_pen_area', 'touches_def_3rd', 'touches_mid_3rd', 'SCA90', 'GCA90', 'Tackles', 'TacklesW', 'TacklesWpct', 'TacklesL', 'TaclkesInterceptions', 'Clr', 'Recov', 'Won', 'Lost', 'Wonpct', 'Att3rd', 'Att_Pen_area', 'PrgCarry', 'CarriesFwd', 'CarriesIntoBox', 'Dispos', 'Recv', 'PrgRec'];

//   const filteredData = data.filter(jogador => statisticsToNormalize.every(stat => jogador[stat] !== null && !isNaN(jogador[stat])));


//   const normalizedData = filteredData.map(jogador => {
//       const normalizedJogador = { ...jogador };
//       for (const stat of statisticsToNormalize) {
//           const values = filteredData.map(j => j[stat]); // Use os dados filtrados aqui
//           const mean = ss.mean(values);
//           const stdDev = ss.standardDeviation(values);
//           const value = jogador[stat];
//           normalizedJogador[`${stat}_zscore`] = ss.zScore(value, mean, stdDev);
//       }
//       return normalizedJogador;
//   });

//   return normalizedData;
// }

// // Função para converter os valores de um objeto para números, se possível
// function convertValuesToNumbers(obj) {
//   const convertedObj = {};
//   for (const [key, value] of Object.entries(obj)) {
//       convertedObj[key] = isNaN(value) ? value : parseFloat(value);
//   }
//   return convertedObj;
// }



// // Função para normalizar os dados com Min-Max
// function normalizeDataWithMinMax(data) {
//   const statisticsToNormalize = ['Remate', 'Defesa']; // Adicione 'Remate' e 'Defesa' à lista de métricas

//   const normalizedData = data.map(jogador => {
//       const normalizedJogador = { ...jogador };
//       for (const stat of statisticsToNormalize) {
//           const values = data.map(j => j[stat]);
//           const minValue = Math.min(...values);
//           const maxValue = Math.max(...values);
//           const value = jogador[stat];
//           normalizedJogador[stat] = (value - minValue) / (maxValue - minValue);
//       }
//       // Adicione a métrica "Remate"
//       normalizedJogador.Remate = normalizedJogador.Goals_zscore + normalizedJogador.Assists_zscore + normalizedJogador.Shots_zscore + normalizedJogador.ShotsOnTarget_zscore + normalizedJogador.npxG_zscore + normalizedJogador.shots_on_target_pct_zscore + normalizedJogador.shots_per90_zscore + normalizedJogador.goals_per_shot_zscore + normalizedJogador.xG_net_zscore + normalizedJogador.TotDist_zscore + normalizedJogador.PrgDist_zscore + normalizedJogador.xAG_zscore + normalizedJogador.xA_zscore + normalizedJogador.PassesCompleted_zscore + normalizedJogador.PassesToFThird_zscore + normalizedJogador.PPA_zscore + normalizedJogador.CrsPA_zscore + normalizedJogador.PrgP_zscore + normalizedJogador.touches_def_pen_area_zscore + normalizedJogador.touches_def_3rd_zscore + normalizedJogador.touches_mid_3rd_zscore + normalizedJogador.SCA90_zscore + normalizedJogador.GCA90_zscore;
//       // Adicione a métrica "Remate_minmax"
//       normalizedJogador.Remate_minmax = (normalizedJogador.Remate - Math.min(...values)) / (Math.max(...values) - Math.min(...values));
//       return normalizedJogador;
//   });

//   return normalizedData;
// }
































// // Ler e combinar os dados de cada arquivo JSON
// files.forEach(filename => {
//     readAndCombineData(filename);
// });

// allData=aggregateData(allData)

// // Converter allData para uma string JSON
// const jsonallDataString = JSON.stringify(allData, null, 2);

// // Escrever a string JSON em um arquivo
// fs.writeFileSync('allData.json', jsonallDataString);

// // Aqui você pode fazer o tratamento e consulta dos dados conforme necessário

// // Tratar os dados com o Lodash (exemplo de normalização)
// const normalizedData = _.map(allData, jogador => ({
//     Player: jogador.player,
//     Nationality: jogador.nationality,
//     Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0, // Verificar se jogador.age está definido
//     BirthYear: jogador.birth_year, // Adicionar birth_year
//     Games: jogador.games, // Adicionar games
//     GamesStarts: jogador.games_starts, // Adicionar games_starts
//     Minutes: jogador.minutes, // Adicionar minutes
//     Minutes90s: jogador.minutes_90s, // Adicionar minutes_90s
//     Goals: jogador.goals, // Adicionar goals
//     Assists: jogador.assists, // Adicionar assists
//     Shots: jogador.shots, // Adicionar shots
//     ShotsOnTarget: jogador.shots_on_target, // Adicionar shots_on_target
//     shots_on_target_pct//SoT%
//     shots_per90//Sh / 90
//     shots_on_target_per90//SoT / 90
//     goals_per_shot//G / Sh
//     goals_per_shot_on_target//G / SoT
//     npxg//	npxG: Non-Penalty xG
//     npxg_per_shot //npxG / Sh	
//     xg_net //G - xG	
//     npxg_net //np: G - xG
//     passes_total_distance// TotDist
//     passes_progressive_distance// PrgDist	
//     xg_assist// xAG	
//     pass_xa// xA
//     // KP
//     passes_completed 
//     passes_into_final_third// 1/3
//     passes_into_penalty_area// PPA
//     crosses_into_penalty_area// CrsPA	
//     progressive_passes// PrgP
//     touches_def_pen_area
//     touches_def_3rd
//     touches_mid_3rd
//     sca_per90//SCA90
//     gca_per90 //GCA90
//     tackles
//     tackles_won
//     challenge_tackles
//     challenges
//     challenge_tackles_pct
//     challenges_lost
//     tackles_interceptions
//     clearances
//     ball_recoveries
//     aerials_won
//     aerials_lost
//     aerials_won_pct
//     touches_att_3rd //Att 3rd
//     touches_att_pen_area //Att Pen
//     take_ons
//     take_ons_won
//     take_ons_won_pct
//     take_ons_tackled
//     take_ons_tackled_pct
//     carries_distance
//     carries_progressive_distance
//     progressive_carries
//     carries_into_final_third
//     carries_into_penalty_area
//     miscontrols
//     dispossessed
//     passes_received
//     progressive_passes_received





//     // Adicione mais campos conforme necessário
// }));

// console.log(normalizedData)
// // Converter os dados normalizados para CSV
// const csvData = _.map(normalizedData, jogador => ({
//     Player: jogador.Player,
//     Nationality: jogador.Nationality,
//     Age: jogador.Age,
//     BirthYear: jogador.BirthYear, // Adicionar birth_year
//     Games: jogador.Games, // Adicionar games
//     GamesStarts: jogador.GamesStarts, // Adicionar games_starts
//     Minutes: jogador.Minutes, // Adicionar minutes
//     Minutes90s: jogador.Minutes90s, // Adicionar minutes_90s
//     Goals: jogador.Goals, // Adicionar goals
//     Assists: jogador.Assists, // Adicionar assists
//     Shots: jogador.Shots, // Adicionar shots
//     ShotsOnTarget: jogador.ShotsOnTarget, // Adicionar shots_on_target
//     // Adicione mais campos conforme necessário
// }));

// // Escrever os dados normalizados em um arquivo CSV
// const csvString = _.map(csvData, jogador => _.values(jogador).join(',')).join('\n');
// fs.writeFileSync('PT23-24.csv', csvString);

// // Converter os dados normalizados para JSON
// const jsonDataString = JSON.stringify(normalizedData, null, 2);

// // Escrever os dados normalizados em um arquivo JSON
// fs.writeFileSync('PT23-24.json', jsonDataString);

// console.log("fim")











// const jsonData = [
//     {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7"
//     },
//     {
//         "Player": "Ricardo Guimarães",
//         "Nationality": "mz MOZ",
//         "Age": 28,
//         "BirthYear": "1995",
//         "Minutes90s": "9.6"
//       },
//     {
//         "Rk": "139",
//         "PlayerCode": null,
//         "Player": "Dario Essugo",
//         "nationality": "pt POR",
//         "position": "MF",
//         "team": "Sporting CP",
//         "age": "18-359",
//         "birth_year": "2005",
//         "minutes_90s": "0.4",
//         "tackles": "5.00",
//         "tackles_won": "5.00",
//         "tackles_def_3rd": "0.00",
//         "tackles_mid_3rd": "5.00",
//         "tackles_att_3rd": "0.00",
//         "challenge_tackles": "2.50",
//         "challenges": "2.50",
//         "challenge_tackles_pct": "100.0",
//         "challenges_lost": "0.00",
//         "blocks": "0.00",
//         "blocked_shots": "0.00",
//         "blocked_passes": "0.00",
//         "interceptions": "0.00",
//         "tackles_interceptions": "5.00",
//         "clearances": "0.00",
//         "errors": "0.00",
//         "matches": "Matches"
//       },
//   {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7"
//     },
//     {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7"
//     },
//     {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7",
//       "Assists": "0.00"
//     },
//     {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7"
//     },
//   {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Games": "20",
//       "GamesStarts": "20",
//       "Minutes": "1,772",
//       "Minutes90s": "19.7",
//       "Goals": "0.05",
//       "Assists": "0.00"
//     },
//   {
//       "Player": "Rodrigo Abascal",
//       "Nationality": "uy URU",
//       "Age": 30,
//       "BirthYear": "1994",
//       "Minutes90s": "19.7",
//       "Goals": "0.05",
//       "Shots": "0.30",
//       "ShotsOnTarget": "0.05"
//     },
//     {
//       "Rk": "139",
//       "PlayerCode": null,
//       "Player": "Dario Essugo",
//       "nationality": "pt POR",
//       "position": "MF",
//       "team": "Sporting CP",
//       "age": "18-359",
//       "birth_year": "2005",
//       "minutes_90s": "0.4",
//       "cards_yellow": "0.00",
//       "cards_red": "0.00",
//       "cards_yellow_red": "0.00",
//       "fouls": "2.50",
//       "fouled": "0.00",
//       "offsides": "0.00",
//       "crosses": "0.00",
//       "interceptions": "0.00",
//       "tackles_won": "5.00",
//       "pens_won": "0.00",
//       "pens_conceded": "0.00",
//       "own_goals": "0.00",
//       "ball_recoveries": "2.50",
//       "aerials_won": "2.50",
//       "aerials_lost": "2.50",
//       "aerials_won_pct": "50.0",
//       "matches": "Matches"
//     },
//     {
//       "Player": "Ricardo Guimarães",
//       "Nationality": "mz MOZ",
//       "Age": 28,
//       "BirthYear": "1995",
//       "Minutes90s": "9.6",
//       "Goals": "0.00",
//       "Shots": "0.83",
//       "ShotsOnTarget": "0.10"
//     }
//   ]
  
// // Criar um objeto para armazenar informações únicas
// const uniqueData = {};

// // Iterar sobre os objetos e armazenar as informações únicas com base no campo 'Player'
// jsonData.forEach(obj => {
//     const key = obj.Player; // Usando 'Player' como chave para identificar informações únicas
//     console.log(key)
//   if (!uniqueData[key]) {
//     uniqueData[key] = obj;
//   } else {
//     // Combinar campos opcionais que podem estar presentes em algumas entradas
//     Object.assign(uniqueData[key], obj);
//   }
// });

// // Converter o objeto de informações únicas de volta para JSON
// const uniqueJsonData = JSON.stringify(Object.values(uniqueData), null, 2);

// console.log(uniqueJsonData);
// const fs = require('fs');
// const _ = require('lodash');

// // Lista de arquivos JSON
// const files = [
//     'data/32-Primeira-Liga/2023-2024/defense/2023-2024-Primeira-Liga-defense.json',
//     'data/32-Primeira-Liga/2023-2024/gca/2023-2024-Primeira-Liga-gca.json',
//     'data/32-Primeira-Liga/2023-2024/misc/2023-2024-Primeira-Liga-misc.json',
//     'data/32-Primeira-Liga/2023-2024/passing/2023-2024-Primeira-Liga-passing.json',
//     'data/32-Primeira-Liga/2023-2024/possession/2023-2024-Primeira-Liga-possession.json',
//     'data/32-Primeira-Liga/2023-2024/standard/2023-2024-Primeira-Liga-standard.json',
// ];

// // Array para armazenar todos os objetos JSON
// let allData = [];

// Função para ler e combinar os dados de um arquivo JSON
// function readAndCombineData(filename) {
//     const data = fs.readFileSync(filename, 'utf8');
//     const jsonData = JSON.parse(data);
//     allData = allData.concat(jsonData);
// }

// // Ler e combinar os dados de cada arquivo JSON
// files.forEach(filename => {
//     readAndCombineData(filename);
// });

// // Aqui você pode fazer o tratamento e consulta dos dados conforme necessário

// // Tratar os dados com o Lodash (exemplo de normalização)
// const normalizedData = _.map(allData, jogador => ({
//     Player: jogador.player,
//     Nationality: jogador.nationality,
//     Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0, // Verificar se jogador.age está definido
//     BirthYear: jogador.birth_year, // Adicionar birth_year
//     Games: jogador.games, // Adicionar games
//     GamesStarts: jogador.games_starts, // Adicionar games_starts
//     Minutes: jogador.minutes, // Adicionar minutes
//     Minutes90s: jogador.minutes_90s, // Adicionar minutes_90s
//     Goals: jogador.goals, // Adicionar goals
//     Assists: jogador.assists, // Adicionar assists
//     // Adicione mais campos conforme necessário
// }));

// // Converter os dados normalizados para CSV
// const csvData = _.map(normalizedData, jogador => ({
//     Player: jogador.Player,
//     Nationality: jogador.Nationality,
//     Age: jogador.Age,
//     BirthYear: jogador.BirthYear, // Adicionar birth_year
//     Games: jogador.Games, // Adicionar games
//     GamesStarts: jogador.GamesStarts, // Adicionar games_starts
//     Minutes: jogador.Minutes, // Adicionar minutes
//     Minutes90s: jogador.Minutes90s, // Adicionar minutes_90s
//     Goals: jogador.Goals, // Adicionar goals
//     Assists: jogador.Assists, // Adicionar assists
//     // Adicione mais campos conforme necessário
// }));

// // Escrever os dados normalizados em um arquivo CSV
// const csvString = _.map(csvData, jogador => _.values(jogador).join(',')).join('\n');
// fs.writeFileSync('PT23-24.csv', csvString);

// // Converter os dados normalizados para JSON
// const jsonDataString = JSON.stringify(normalizedData, null, 2);

// // Escrever os dados normalizados em um arquivo JSON
// fs.writeFileSync('PT23-24.json', jsonDataString);














// const fs = require('fs');
// const _ = require('lodash');

// // Lista de arquivos JSON
// const files = [
//     'data/32-Primeira-Liga/2023-2024/defense/2023-2024-Primeira-Liga-defense.json',
//     'data/32-Primeira-Liga/2023-2024/gca/2023-2024-Primeira-Liga-gca.json',
//     'data/32-Primeira-Liga/2023-2024/misc/2023-2024-Primeira-Liga-misc.json',
//     'data/32-Primeira-Liga/2023-2024/passing/2023-2024-Primeira-Liga-passing.json',
//     'data/32-Primeira-Liga/2023-2024/possession/2023-2024-Primeira-Liga-possession.json',
//     'data/32-Primeira-Liga/2023-2024/standard/2023-2024-Primeira-Liga-standard.json',
// ];

// // Array para armazenar todos os objetos JSON
// let allData = [];

// // Função para ler e combinar os dados de um arquivo JSON
// function readAndCombineData(filename) {
//     const data = fs.readFileSync(filename, 'utf8');
//     const jsonData = JSON.parse(data);
//     allData = allData.concat(jsonData);
// }

// // Ler e combinar os dados de cada arquivo JSON
// files.forEach(filename => {
//     readAndCombineData(filename);
// });

// // Aqui você pode fazer o tratamento e consulta dos dados conforme necessário

// // Por exemplo, você pode normalizar os campos repetidos

// // Converter allData para uma string JSON
// const jsonDataString = JSON.stringify(allData, null, 2);

// // Escrever a string JSON em um arquivo
// fs.writeFileSync('allData.json', jsonDataString);

// // Tratar os dados com o Lodash (exemplo de normalização)
// // Tratar os dados com o Lodash (exemplo de normalização)
// const normalizedData = _.map(allData, jogador => ({
//     Player: jogador.player,
//     Nationality: jogador.nationality,
//     Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0, // Verificar se jogador.age está definido
//     // Adicione mais campos conforme necessário
// }));

// // Converter os dados normalizados para CSV
// const csvData = _.map(normalizedData, jogador => ({
//     Player: jogador.Player,
//     Nationality: jogador.Nationality,
//     Age: jogador.Age,
//     // Adicione mais campos conforme necessário
// }));

// // Escrever os dados normalizados em um arquivo CSV
// const csvString = _.map(csvData, jogador => _.values(jogador).join(',')).join('\n');
// fs.writeFileSync('allData.csv', csvString);

// // Iterar sobre o array allData e imprimir o nome de cada jogador
// allData.forEach(player => {
//     console.log(player.player);
// });

// // Iterar sobre o array allData e imprimir idade e nacionalidade de cada jogador
// allData.forEach(player => {
//     console.log(`Jogador: ${player.player}, Idade: ${player.age}, Nacionalidade: ${player.nationality}`);
// });

// // Tratar os dados com o Lodash (exemplo de normalização)
// const normalizedData = _.map(allData, jogador => ({
//     Player: jogador.player,
//     Nationality: jogador.nationality,
//     Age: jogador.age ? parseInt(jogador.age.split('-')[0]) : 0, // Verificar se jogador.age está definido
//     BirthYear: jogador.birth_year, // Adicionar birth_year
//     Games: jogador.games, // Adicionar games
//     GamesStarts: jogador.games_starts, // Adicionar games_starts
//     Minutes: jogador.minutes, // Adicionar minutes
//     Minutes90s: jogador.minutes_90s, // Adicionar minutes_90s
//     Goals: jogador.goals, // Adicionar goals
//     Assists: jogador.assists, // Adicionar assists
//     // Adicione mais campos conforme necessário
// }));

// // Converter os dados normalizados para CSV
// const csvData = _.map(normalizedData, jogador => ({
//     Player: jogador.Player,
//     Nationality: jogador.Nationality,
//     Age: jogador.Age,
//     BirthYear: jogador.BirthYear, // Adicionar birth_year
//     Games: jogador.Games, // Adicionar games
//     GamesStarts: jogador.GamesStarts, // Adicionar games_starts
//     Minutes: jogador.Minutes, // Adicionar minutes
//     Minutes90s: jogador.Minutes90s, // Adicionar minutes_90s
//     Goals: jogador.Goals, // Adicionar goals
//     Assists: jogador.Assists, // Adicionar assists
//     // Adicione mais campos conforme necessário
// }));

// // Escrever os dados normalizados em um arquivo CSV
// const csvString = _.map(csvData, jogador => _.values(jogador).join(',')).join('\n');
// fs.writeFileSync('PT23-24.csv', csvString);

// // Converter allData para uma string JSON
// const jsonDataString = JSON.stringify(normalizedData, null, 2);

// // Escrever a string JSON em um arquivo
// fs.writeFileSync('PT23-24.json', jsonDataString);










// const fs = require('fs');

// const files = [
//     'data/32-Primeira-Liga/2023-2024/defense/2023-2024-Primeira-Liga-defense.json',
//     'data/32-Primeira-Liga/2023-2024/gca/2023-2024-Primeira-Liga-gca.json',
//     'data/32-Primeira-Liga/2023-2024/misc/2023-2024-Primeira-Liga-misc.json',
//     'data/32-Primeira-Liga/2023-2024/passing/2023-2024-Primeira-Liga-passing.json',
//     'data/32-Primeira-Liga/2023-2024/possession/2023-2024-Primeira-Liga-possession.json',
//     'data/32-Primeira-Liga/2023-2024/standard/2023-2024-Primeira-Liga-standard.json',
//     'data/32-Primeira-Liga/2023-2024/shooting/2023-2024-Primeira-Liga-shooting.json',
// ];

// // Array para armazenar todos os objetos JSON
// let allData = [];

// // Função para ler e combinar os dados de um arquivo JSON
// function readAndCombineData(filename) {
//     const data = fs.readFileSync(filename, 'utf8');
//     const jsonData = JSON.parse(data);
//     allData = allData.concat(jsonData);
// }

// // Ler e combinar os dados de cada arquivo JSON
// files.forEach(filename => {
//     readAndCombineData(filename);
// });

// // Aqui você pode fazer o tratamento e consulta dos dados conforme necessário

// // Por exemplo, você pode normalizar os campos repetidos


// // // Agora você pode usar os dados normalizados para consulta ou qualquer outra finalidade
// // console.log(allData);

// // // Converter allData para uma string JSON
// // const jsonDataString = JSON.stringify(allData, null, 2);

// // // Escrever a string JSON em um arquivo
// // fs.writeFileSync('allData.json', jsonDataString);

// // // Iterar sobre o array allData e imprimir o nome de cada jogador
// // allData.forEach(player => {
// //     console.log(player.player);
// // });

// // // Iterar sobre o array allData e imprimir idade e nacionalidade de cada jogador
// // allData.forEach(player => {
// //     console.log(`Jogador: ${player.player}, Idade: ${player.age}, Nacionalidade: ${player.nationality}`);
// // });

// // const jogadoresComMaisDe25Anos = _.filter(allData, jogador => {
// //     return parseInt(jogador.age) > 25;
// // });

// // console.log(jogadoresComMaisDe25Anos);

// // const jogadoresOrdenadosPorIdade = _.sortBy(allData, jogador => {
// //     return parseInt(jogador.age);
// // });

// // console.log(jogadoresOrdenadosPorIdade);

// // const jogadoresAgrupadosPorNacionalidade = _.groupBy(allData, 'nationality');

// // console.log(jogadoresAgrupadosPorNacionalidade);

// // const idades = _.map(allData, jogador => parseInt(jogador.age));
// // const mediaIdade = _.mean(idades);

// // console.log(`A média de idade dos jogadores é ${mediaIdade} anos.`);


// // const jogadorComMaisTackles = _.maxBy(allData, 'tackles');

// // console.log(jogadorComMaisTackles);





// // const _ = require('lodash');

// // // Calcular as idades dos jogadores com base no ano de nascimento
// // const idades = _.map(allData, jogador => {
// //     const anoNascimento = parseInt(jogador.birth_year);
// //     const anoAtual = new Date().getFullYear();
// //     return anoAtual - anoNascimento;
// // });

// // // Calcular a média de idade dos jogadores
// // const mediaIdade = _.mean(idades);

// // console.log(`A média de idade dos jogadores é ${mediaIdade} anos.`);

// // // Encontrar o jogador com mais tackles
// // const jogadorComMaisTackles = _.maxBy(allData, 'tackles');

// // console.log(jogadorComMaisTackles);


// // const _ = require('lodash');

// // // Mapear jogadores com suas idades
// // const jogadoresComIdade = _.map(allData, jogador => {
// //     const anoNascimento = parseInt(jogador.birth_year);
// //     // Verificar se o ano de nascimento é um número válido
// //     if (!isNaN(anoNascimento)) {
// //         const anoAtual = new Date().getFullYear();
// //         const idade = anoAtual - anoNascimento;
// //         return { jogador: jogador.player, idade: idade };
// //     } else {
// //         // Se o ano de nascimento não for válido, retornar idade como 0
// //         return { jogador: jogador.player, idade: 0 };
// //     }
// // });

// // // Imprimir lista de jogadores com suas idades
// // console.log("Jogadores e suas idades:");
// // console.log(jogadoresComIdade);

// // // Calcular a média de idade dos jogadores
// // const idadesValidas = _.filter(_.map(jogadoresComIdade, 'idade'), idade => idade !== 0);
// // const mediaIdade = _.mean(idadesValidas);

// // // Imprimir média de idade
// // console.log(`A média de idade dos jogadores é ${mediaIdade} anos.`);

