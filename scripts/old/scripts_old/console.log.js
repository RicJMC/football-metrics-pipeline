const fs = require('fs').promises;

// Função para ler os dados do arquivo JSON
async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo JSON ${filename}: ${error.message}`);
        return [];
    }
}

// Função principal assíncrona
async function main() {
    try {
        // Ler os dados do arquivo JSON
        const jsonData = await readJSONFile('PT23-24.json');

        // Obter os 20 primeiros jogadores com mais de 8 Minutes90s e ordenados por PrgCarry_zscore
        const topPlayers = jsonData
            .filter(jogador => jogador.Minutes90s > 8 && !isNaN(jogador.PrgCarry_zscore))
            .sort((a, b) => b.PrgCarry_zscore - a.PrgCarry_zscore)
            .slice(0, 20);

        // Imprimir os jogadores no console
        console.log("Os 20 primeiros jogadores em progressive carries normalizados (PrgCarry_zscore) com mais de 8 Minutes90s:");
        topPlayers.forEach((jogador, index) => {
            console.log(`${index + 1}. ${jogador.Player}: ${jogador.PrgCarry_zscore}`);
        });
    } catch (error) {
        console.error(`Erro no programa: ${error}`);
    }
}

// Chamar a função principal
main();