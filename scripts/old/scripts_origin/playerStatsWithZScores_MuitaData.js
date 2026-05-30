const fs = require('fs');
const ss = require('simple-statistics');

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

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
const jsonData = fs.readFileSync('playerStatsFiltered.JSON');
const data = JSON.parse(jsonData);

// Nome do arquivo de log
const logFile = 'errorLog.txt';

// Calcular a média e o desvio padrão para todos os valores numéricos
const stats = calculateStats(data, logFile);

// Adicionar Z-scores aos dados
const dataWithZScores = addZScores(data, stats, logFile);

// Dividir os dados em partes menores
const chunkedData = chunkArray(Object.entries(dataWithZScores), 7000);

// Salvar cada parte em um arquivo JSON separado
chunkedData.forEach((chunk, index) => {
  const fileName = `playerStatsWithZScores_${index}.json`;
  fs.writeFileSync(fileName, JSON.stringify(Object.fromEntries(chunk), null, 2));
});

console.log('Z-scores adicionados com sucesso!!');