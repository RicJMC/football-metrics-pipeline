/** @format */

const fs = require('fs');
const path = require('path');

function generateFiles(seasons, league, competitionId, categories) {
  const baseDirectory = '../data';
  const files = [];

  for (const season of seasons) {
    for (const category of categories) {
      const fileName = path.join(
        baseDirectory,
        `${competitionId}-${league}`,
        season,
        category,
        `${season}-${league}-${category}.json`,
      );
      files.push(fileName);
      // console.log(fileName)
    }
  }

  return files;
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    // console.log(filePath)
    return true;
  } catch (error) {
    return false;
  }
}

function extractSeason(filePath) {
  const parts = filePath.split(path.sep);
  //  console.log(parts[parts.length - 3]);
  return parts[parts.length - 3];
}

function extractLeagueName(filePath) {
  const parts = filePath.split(path.sep);
  const fileName = parts[parts.length - 1];
  let leagueName = fileName.replace(/\d+-/g, '').replace('.json', '');
  leagueName = leagueName.replace(/-?\s?(standard|shooting|passing|gca|defense|possession|misc)$/g
  , '');
  // console.log(leagueName);
  return leagueName;
}


const serieASeasons = ['2019', '2020', '2021', '2022', '2023','2024'];
const serieALeague = 'Serie-A';
const serieACompetitionId = '24';
const serieACategories = [
  'standard',
  'keeper_adv',
  'shooting',
  'passing',
  'gca',
  'defense',
  'possession',
  'misc',
];
const serieAFiles = generateFiles(
  serieASeasons,
  serieALeague,
  serieACompetitionId,
  serieACategories,
);

const europeanLeaguesSeasons = ['2017-2018'];
const europeanLeaguesLeague = 'European-Leagues';
const europeanLeaguesCompetitionId = 'Big5';
const europeanLeaguesCategories = [
  'standard',
  'keeper_adv',
  'shooting',
  'passing',
  'gca',
  'defense',
  'possession',
  'misc',
];
const europeanLeaguesFiles = generateFiles(
  europeanLeaguesSeasons,
  europeanLeaguesLeague,
  europeanLeaguesCompetitionId,
  europeanLeaguesCategories,
);

const leagues = [
  {
    name: 'Champions-League',
    id: '8',
    seasons: ['2017-2018','2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Championship',
    id: '10',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Copa-Libertadores',
    id: '14',
    seasons: ['2019', '2020', '2021', '2022', '2023','2024'],
  },
  {
    name: 'Segunda-Division',
    id: '17',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Serie-B',
    id: '18',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Europa-League',
    id: '19',
    seasons: ['2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Primera-Division',
    id: '21',
    seasons: ['2016-2017', '2017-2018','2018-2019', '2021', '2022', '2023'],
  },
  {
    name: 'Major-League-Soccer',
    id: '22',
    seasons: ['2019', '2020', '2021', '2022', '2023','2024'],
  },
  {
    name: 'Eredivisie',
    id: '23',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Serie-A',
    id: '24',
    seasons: ['2019', '2020', '2021', '2022', '2023','2024'],
  },
  {
    name: 'Liga-MX',
    id: '31',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Primeira-Liga',
    id: '32',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: '2-Bundesliga',
    id: '33',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Belgian-Pro-League',
    id: '37',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Ligue-2',
    id: '60',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'Europa-Conference-League',
    id: '882',
    seasons: ['2021-2022', '2022-2023','2023-2024'],
  },
  {
    name: 'European-Leagues',
    id: 'Big5',
    seasons: [
      '2017-2018',
      '2018-2019',
      '2019-2020',
      '2020-2021',
      '2021-2022',
      '2022-2023',
      '2023-2024'
    ],
  },
];

const combinedFiles = [];

for (const league of leagues) {
  const leagueFiles = generateFiles(
    league.seasons,
    league.name,
    league.id,
    serieACategories,
  );
  combinedFiles.push(...leagueFiles);
  // console.log(leagueFiles);
}

function readJSONFile(filePath) {
  try {
    if (fileExists(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      console.error(`O arquivo ${filePath} não existe.`);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}: ${error}`);
    return null;
  }
}

function combineJSONFiles(filePaths) {
  const combinedData = {};
  for (const filePath of filePaths) {
    const data = readJSONFile(filePath);
    if (data) {
      const season = extractSeason(filePath);
      const leagueName = extractLeagueName(filePath);
      if (!combinedData[leagueName]) {
        combinedData[leagueName] = {};
      }
      if (!combinedData[leagueName][season]) {
        combinedData[leagueName][season] = {};
      }
      const category = path.basename(path.dirname(filePath));
      combinedData[leagueName][season][category] = data;
    }
  }
  return combinedData;
}

function writeJSONFile(data, outputFile) {
  try {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`Arquivo JSON criado com sucesso: ${outputFile}`);
  } catch (error) {
    console.error(`Erro ao escrever o arquivo JSON: ${error}`);
  }
}

const jsonFiles = combinedFiles;
const combinedData = combineJSONFiles(jsonFiles);
writeJSONFile(combinedData, '../jsonfiles/playerstats00_raw_combinedData.json');

function generateKey(player, league, season) {
  // Gera uma chave única para cada jogador baseada no nome do jogador
  // console.log(`${season}-${league}-${player.player}-${player.birth_year}-${player.nationality}-${player.team}`)
  return `${season}-${league}-${player.player}-${player.birth_year}-${player.nationality}-${player.team}`;
}

function extractPlayerStatsUnicos(combinedData) {
  let playerStatsUnicos = {};

  for (const league in combinedData) {
    for (const season in combinedData[league]) {
      const categories = combinedData[league][season];
      
      for (const category in categories) {
        const players = categories[category];
        for (const player of players) {
          const key = generateKey(player, league, season);
          const playerName = player.player;

          if (!playerStatsUnicos[playerName]) {
            playerStatsUnicos[playerName] = {
              Player: playerName,
              Seasons: {},
            };
          }

          if (!playerStatsUnicos[playerName].Seasons[season]) {
            playerStatsUnicos[playerName].Seasons[season] = {
              Teams: {},
            };
          }

          if (!playerStatsUnicos[playerName].Seasons[season].Teams[player.team]) {
            playerStatsUnicos[playerName].Seasons[season].Teams[player.team] = {
              League: league,
              BirthYear: player.birth_year,
              Nationality: player.nationality,
              Age: player.age ? parseInt(player.age.split('-')[0]) : 0,
              Team: player.team,
            };
          }

          for (const [stat, value] of Object.entries(player)) {
            if (value !== undefined && stat !== 'player' && stat !== 'birth_year' && stat !== 'nationality' && stat !== 'team' && stat !== 'age') {
              if (!playerStatsUnicos[playerName].Seasons[season].Teams[player.team][stat]) {
                playerStatsUnicos[playerName].Seasons[season].Teams[player.team][stat] = value;
              }
            }
          }
        }
      }
    }
  }

  return playerStatsUnicos;
}

function writePlayerDataToFile(playerStats, outputFile) {
  try {
    fs.writeFileSync(outputFile, JSON.stringify(playerStats, null, 2));
    console.log(
      `Arquivo JSON com os dados dos jogadores criado com sucesso: ${outputFile}`,
    );
  } catch (error) {
    console.error(
      `Erro ao escrever o arquivo JSON com os dados dos jogadores: ${error}`,
    );
  }
}
const playerStatsUnicos = extractPlayerStatsUnicos(combinedData);


function writeJSONFiles(data, outputFilePrefix) {
  try {
    const keys = Object.keys(data);
    const chunkSize = 6000; // Define o tamanho de cada parte
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunkKeys = keys.slice(i, i + chunkSize);
      const chunkData = {};
      for (const key of chunkKeys) {
        chunkData[key] = data[key];
      }
      const outputFile = `${outputFilePrefix}_${i / chunkSize}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(chunkData, null, 2));
      console.log(`Arquivo JSON criado com sucesso: ${outputFile}`);
    }
  } catch (error) {
    console.error(`Erro ao escrever o arquivo JSON: ${error}`);
  }
}


// Escrever o objeto playerStatsUnicos em um arquivo JSON
writePlayerDataToFile(playerStatsUnicos, '../jsonfiles/playerStats01_Unicos.json');

const outputFilePrefix = '../jsonfiles/playerStats01_Unicos_chunk';
writeJSONFiles(playerStatsUnicos, outputFilePrefix);
