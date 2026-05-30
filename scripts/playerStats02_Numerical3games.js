const fs = require('fs');

// Função para converter dados em números, se possível
function convertToNumbers(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      convertToNumbers(obj[key]);
    } else if (!isNaN(parseFloat(obj[key]))) {
      obj[key] = parseFloat(obj[key]);
    }
  }
  return obj;
}

function removePlayersWithLessThanThreeMinutes(obj) {
  for (const player in obj) {
    try {
      if (obj[player] && obj[player].Seasons) {
        for (const season in obj[player].Seasons) {
          if (obj[player].Seasons[season] && obj[player].Seasons[season].Teams) {
            for (const team in obj[player].Seasons[season].Teams) {
              if (obj[player].Seasons[season].Teams[team] && parseFloat(obj[player].Seasons[season].Teams[team].minutes_90s) < 3) {
                console.log(`Removing data for player '${player}' in season '${season}' with team '${team}'`);
                delete obj[player].Seasons[season].Teams[team];
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }
  return obj;
}


// Função para escrever o objeto em um arquivo JSON
function writeJSONFile(data, outputFile) {
  try {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`Arquivo JSON criado com sucesso: ${outputFile}`);
  } catch (error) {
    console.error(`Erro ao escrever o arquivo JSON: ${error}`);
  }
}

// Ler o arquivo JSON playerStatsUnicos.json
const playerStatsData = fs.readFileSync('../jsonfiles/playerStats01_Unicos.json', 'utf8');
const playerStats = JSON.parse(playerStatsData);

// Converter os dados para números
const playerStatsNumerical = convertToNumbers(playerStats);

// Remover jogadores com menos de 3 minutes_90s
const filteredPlayerStats = removePlayersWithLessThanThreeMinutes(playerStatsNumerical);

// Escrever os dados convertidos em um novo arquivo JSON
writeJSONFile(filteredPlayerStats, '../jsonfiles/playerStats02_Filtered.JSON');

// Escrever os dados convertidos em um novo arquivo JSON
writeJSONFile(playerStatsNumerical, '../jsonfiles/playerStats02_Numerical.JSON');