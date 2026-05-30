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
const playerStatsData = fs.readFileSync('playerStatsUnicos.json', 'utf8');
const playerStats = JSON.parse(playerStatsData);

// Converter os dados para números
const playerStatsNumerical = convertToNumbers(playerStats);

// Escrever os dados convertidos em um novo arquivo JSON
writeJSONFile(playerStatsNumerical, 'playerStatsNumerical.JSON');