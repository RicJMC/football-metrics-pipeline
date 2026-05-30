const fs = require('fs').promises;

// Função para ler os dados do arquivo JSON
async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo JSON ${filename}: ${error.message}`);
        return {};
    }
}

// Função principal assíncrona
async function main() {
    try {
        // Ler os dados do arquivo JSON
        const jsonData = await readJSONFile('playerStatsWithZScores.json');

        // Array para armazenar os jogadores
        const players = [];

        // Iterar sobre os jogadores no arquivo JSON
        for (const playerName in jsonData) {
            const playerData = jsonData[playerName];
            const seasons = playerData['Seasons'];
            for (const seasonKey in seasons) {
                const teams = seasons[seasonKey]['Teams'];
                for (const teamName in teams) {
                    const playerStats = teams[teamName];
                    // Verificar se o jogador atende aos critérios
                    if (playerStats['minutes_90s'] > 8 &&
                        !isNaN(playerStats['progressive_carries_zScore']) &&
                        playerStats['games_starts'] >= 15) {
                        // Adicionar jogador ao array
                        players.push({
                            Player: playerName,
                            progressive_carries_zScore: playerStats['progressive_carries_zScore']
                        });
                    }
                }
            }
        }

        // Ordenar jogadores por progressive_carries_zScore em ordem decrescente
        players.sort((a, b) => b.progressive_carries_zScore - a.progressive_carries_zScore);

        // Imprimir os 50 primeiros jogadores no console
        console.log("Os 50 primeiros jogadores em progressive carries normalizados (PrgCarry_zscore) com mais de 8 Minutes90s e pelo menos 15 jogos a titular:");
        players.slice(0, 50).forEach((player, index) => {
            console.log(`${index + 1}. ${player.Player}: ${player.progressive_carries_zScore}`);
        });
    } catch (error) {
        console.error(`Erro no programa: ${error}`);
    }
}

// Chamar a função principal
main();
