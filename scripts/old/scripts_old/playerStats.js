/** @format */

const fs = require('fs');
const path = require('path');

function generateFiles(seasons, league, competitionId, categories) {
  const baseDirectory = 'data';
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


const serieASeasons = ['2019', '2020', '2021', '2022', '2023'];
const serieALeague = 'Serie-A';
const serieACompetitionId = '24';
const serieACategories = [
  'standard',
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
    name: 'Primeira-Liga',
    id: '32',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023'],
  },
  {
    name: 'Eredivisie',
    id: '23',
    seasons: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023'],
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
    ],
  },
  {
    name: 'Serie-A',
    id: '24',
    seasons: ['2019', '2020', '2021', '2022', '2023'],
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
  console.log(leagueFiles);
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
writeJSONFile(combinedData, 'combinedData.json');

function generateKey(player, league, season) {
  // Gera uma chave única para cada jogador baseada no nome do jogador
  // console.log(`${season}-${league}-${player.player}-${player.birth_year}-${player.nationality}-${player.team}`)
  return `${season}-${league}-${player.player}-${player.birth_year}-${player.nationality}-${player.team}`;
}


function extractPlayerStats(combinedData) {

  let playerStats = {};

  for (const league in combinedData) {
    for (const season in combinedData[league]) {
      const categories = combinedData[league][season];
      
      for (const category in categories) {
        const players = categories[category];
        for (const player of players) {
          const key = generateKey(player, league, season);
          if (!playerStats[key]) {
            playerStats[key] = []; // Inicializa como um array vazio se ainda não existir
          }
          // Filtra as propriedades com valor undefined
          const filteredPlayer = Object.fromEntries(Object.entries(player).filter(([key, value]) => value !== undefined));
          // Adiciona as estatísticas do jogador na categoria atual ao array de estatísticas
          playerStats[key].push({
            Season: season,
            League: league,
            Player: player.player,
            BirthYear: player.birth_year,
            Nationality: player.nationality,
            Age: player.age ? parseInt(player.age.split('-')[0]) : 0,
            Team: player.team,
            Games: player.games,
            GamesStarts: player.games_starts,
            Minutes: player.minutes,
            Minutes90s: player.minutes_90s,
            Goals: player.goals,
            Assists: player.assists,
            Shots: player.shots,
            ShotsOnTarget: player.shots_on_target,
            shots_on_target_pct: player.shots_on_target_pct,
            shots_per90: player.shots_per90,
            shots_on_target_per90: player.shots_on_target_per90,
            goals_per_shot: player.goals_per_shot,
            goals_per_shot_on_target: player.goals_per_shot_on_target,
            npxG: player.npxg,
            npxG_per_shot: player.npxg_per_shot,
            xG_net: player.xg_net,
            npxG_net: player.npxg_net,
            TotDist: player.passes_total_distance,
            PrgDist: player.passes_progressive_distance,
            xAG: player.xg_assist,
            xA: player.pass_xa,
            PassesCompleted: player.passes_completed,
            PassesToFThird: player.passes_into_final_third,
            PPA: player.passes_into_penalty_area,
            CrsPA: player.crosses_into_penalty_area,
            PrgP: player.progressive_passes,
            touches_def_pen_area: player.touches_def_pen_area,
            touches_def_3rd: player.touches_def_3rd,
            touches_mid_3rd: player.touches_mid_3rd,
            SCA90: player.sca_per90,
            GCA90: player.gca_per90,
            Tackles: player.tackles,
            TacklesW: player.tackles_won,
            TacklesWpct: player.challenge_tackles_pct,
            TacklesL: player.challenges_lost,
            TaclkesInterceptions: player.tackles_interceptions,
            Clr: player.clearances,
            Recov: player.ball_recoveries,
            Won: player.aerials_won,
            Lost: player.aerials_lost,
            Wonpct: player.aerials_won_pct,
            Att3rd: player.touches_att_3rd,
            Att_Pen_area: player.touches_att_pen_area,
            PrgCarry: player.progressive_carries,
            CarriesFwd: player.carries_into_final_third,
            CarriesIntoBox: player.carries_into_penalty_area,
            Dispos: player.dispossessed,
            Recv: player.passes_received,
            PrgRec: player.progressive_passes_received,
          })
        }
      }
    }
  }
    // Filtra as entradas com valores undefined-undefined-undefined-undefined
    playerStats = Object.fromEntries(
      Object.entries(playerStats).filter(([key, value]) => !key.includes("undefined"))
  );

  return playerStats;
}


const playerStats = extractPlayerStats(combinedData);

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
writePlayerDataToFile(playerStats, 'playerStats.json');

// Função para criar um novo objeto com dados únicos para cada jogador
function criarNovoObjetoComDadosUnicos(dados) {
  let novoObjeto = {};

  for (let chave in dados) {
    let dadosUnicos = {};
    dados[chave].forEach((objeto) => {
      Object.assign(dadosUnicos, objeto);
    });
    novoObjeto[chave] = [dadosUnicos];
  }

  return novoObjeto;
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

const playerStatsUnicos = extractPlayerStatsUnicos(combinedData);

// Escrever o objeto playerStatsUnicos em um arquivo JSON
writePlayerDataToFile(playerStatsUnicos, 'playerStatsUnicos.json');




const playerToFind = '2018-2019-Primeira-Liga-Mohamed Abarhoun-1989-ma MAR-Moreirense';

function findPlayerStats(playerStats, playerToFind) {
  const playerKey = Object.keys(playerStats).find(key => key.includes(playerToFind));
  if (playerKey) {
    console.log(playerStats[playerKey]);
  } else {
    console.log('Jogador não encontrado.');
  }
}

findPlayerStats(playerStats, playerToFind);