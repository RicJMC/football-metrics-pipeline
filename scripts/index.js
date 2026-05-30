const { exec } = require('child_process');

// Função para executar os scripts em sequência
function runScriptsSequentially(scripts, index = 0) {
    if (index < scripts.length) {
        const script = scripts[index];
        console.log(`Executando script: ${script}`);
        exec(`node ${script}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o script ${script}: ${error}`);
                return;
            }
            console.log(`Saída do script ${script}: ${stdout}`);
            runScriptsSequentially(scripts, index + 1); // Executar próximo script
        });
    } else {
        console.log("Todos os scripts foram executados.");
    }
}

// Lista de scripts a serem executados em ordem
const scripts = [
    'playerStats01_unicos.js',
    'playerStats02_Numerical3games.js',
    'playerStats03_ZScores.js',
    'playerStats04_Metrics.js',
    'playerStats05_CSV.js'
];

// Iniciar a execução dos scripts em sequência
runScriptsSequentially(scripts);
