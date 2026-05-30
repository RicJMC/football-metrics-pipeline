const { exec } = require('child_process');
const path = require('path');

// Lista de scripts a serem executados em ordem
const scripts = [
    'playerStats01_unicos.js',
    'playerStats02_Numerical3games.js',
    'playerStats03_ZScores.js',
    'playerStats04_Metrics.js',
    'playerStats05_CSV.js'
];

// Diretório onde os scripts estão localizados
const scriptsDir = path.join(__dirname, 'scripts');

// Função para executar o próximo script na lista
function executeNextScript(index) {
    if (index < scripts.length) {
        const script = scripts[index];
        const scriptPath = path.join(scriptsDir, script);
        console.log(`Executando script: ${scriptPath}`);
        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o script ${scriptPath}: ${error}`);
                return;
            }
            console.log(`Saída do script ${scriptPath}: ${stdout}`);
            // Se não houve erro, executar o próximo script
            executeNextScript(index + 1);
        });
    } else {
        console.log("Todos os scripts foram executados.");
    }
}

// Iniciar a execução do primeiro script
executeNextScript(0);
