const fs = require('fs');
const ss = require('simple-statistics');

// Constantes para as métricas
const METRICAS = {
  defesaconstroi: {
    attributes: ['tackles_zScore', 'tackles_won_zScore','challenge_tackles_zScore','challenge_tackles_pct_zScore', 'blocks_zScore', 'blocked_passes_zScore', 'tackles_interceptions_zScore','clearances_zScore', 'aerials_won_zScore', 'aerials_won_pct_zScore', 'ball_recoveries_zScore','passes_completed_zScore','passes_pct_zScore','passes_progressive_distance_zScore','progressive_passes_zScore','carries_zScore','carries_distance_zScore','carries_progressive_distance_zScore'],
    name: 'DefesaC'
  },
  defesadestroi: {
    attributes: ['tackles_zScore', 'tackles_won_zScore','challenge_tackles_zScore','challenge_tackles_pct_zScore', 'blocks_zScore', 'blocked_passes_zScore', 'tackles_interceptions_zScore','clearances_zScore', 'aerials_won_zScore', 'aerials_won_pct_zScore', 'ball_recoveries_zScore'],
    name: 'DefesaC'
  },
  passing: {
    attributes: ['passes_completed_zScore','passes_pct_zScore','passes_progressive_distance_zScore','xg_assist_per90_zScore','pass_xa_zScore','assisted_shots_zScore','passes_into_final_third_zScore','passes_into_penalty_area_zScore','crosses_into_penalty_area_zScore','progressive_passes_zScore','progressive_passes_received_zScore'],
    name: 'Passing'
  },
  creationgoalshot: {
    attributes: ['sca_per90_zScore','gca_per90_zScore','sca_take_ons_zScore','sca_shots_zScore','sca_fouled_zScore','sca_defense_zScore','gca_take_ons_zScore','gca_shots_zScore','gca_fouled_zScore','gca_defense_zScore'],
    name: 'Creationgoalshot'
  },
  remate: {
    attributes: ['shots_zScore', 'shots_on_target_zScore','shots_on_target_pct_zScore','shots_per90_zScore','shots_on_target_per90_zScore','goals_per_shot_zScore','goals_per_shot_on_target_zScore','npxg','npxg_per_shot_zScore','xg_net_zScore'],
    name: 'Remate'
  },
  carrie: {
    attributes: ['touches_att_3rd_zScore','touches_att_pen_area_zScore','take_ons_won_zScore','take_ons_won_pct_zScore','carries_zScore','carries_distance_zScore','carries_progressive_distance_zScore','carries_into_final_third_zScore','carries_into_penalty_area_zScore','progressive_passes_received_zScore','sca_take_ons_zScore','gca_take_ons_zScore'],
    name: 'Carrie'
  },
  avfixo: {
    attributes: ['shots_zScore', 'shots_on_target_zScore','shots_on_target_pct_zScore','shots_per90_zScore','shots_on_target_per90_zScore','goals_per_shot_zScore','goals_per_shot_on_target_zScore','npxg','npxg_per_shot_zScore','xg_net_zScore','progressive_passes_received_zScore','aerials_won_pct_zScore','aerials_won_zScore','touches_att_pen_area_zScore','sca_take_ons_zScore','gca_take_ons_zScore','gca_shots_zScore','sca_shots_zScore','sca_fouled_zScore','gca_fouled_zScore','tackles_att_3rd_zScore','take_ons_won_zScore','take_ons_won_pct_zScore'],
    name: 'AvFixo'
  },
  dribler: {
    attributes: ['ball_recoveries_zScore', 'crosses_into_penalty_area_zScore','crosses_zScore','fouled_zScore','progressive_passes_received_zScore','progressive_carries_zScore','carries_into_final_third_zScore','carries_into_penalty_area_zScore','carries_zScore','carries_distance_zScore','carries_progressive_distance_zScore','take_ons_tackled_zScore','take_ons_won_zScore','touches_live_ball_zScore','touches_att_pen_area_zScore','touches_att_3rd_zScore','tackles_interceptions_zScore','blocks_zScore','challenge_tackles_zScore','challenges_lost_zScore','gca_fouled_zScore','gca_shots_zScore','gca_take_ons_zScore','gca_per90_zScore','sca_fouled_zScore','sca_shots_zScore','sca_take_ons_zScore','sca_per90_zScore','progressive_passes_zScore','xg_assist_per90_zScore','pass_xa_zScore','assisted_shots_zScore','passes_into_final_third_zScore','passes_into_penalty_area_zScore','crosses_into_penalty_area_zScore'],
    name: 'dribler'
  },
  avmovel: {
    attributes: ['shots_zScore', 'shots_on_target_zScore','shots_on_target_pct_zScore','shots_per90_zScore','shots_on_target_per90_zScore','goals_per_shot_zScore','goals_per_shot_on_target_zScore','npxg','npxg_per_shot_zScore','xg_net_zScore','progressive_passes_received_zScore','aerials_won_pct_zScore','aerials_won_zScore','touches_att_pen_area_zScore','sca_take_ons_zScore','gca_take_ons_zScore','gca_shots_zScore','sca_shots_zScore','sca_fouled_zScore','gca_fouled_zScore','tackles_att_3rd_zScore','touches_att_3rd_zScore','take_ons_won_zScore','take_ons_won_pct_zScore','progressive_carries_zScore','xg_assist_zScore','pass_xa_zScore'],
    name: 'AvMovel'
  }
};

// Função para adicionar uma métrica aos dados
function addMetrica(data, metrica, logFile) {
  for (const jogador in data) {
    const seasons = data[jogador].Seasons;
    for (const season in seasons) {
      const teams = seasons[season].Teams;
      for (const team in teams) {
        const teamData = teams[team];
        const attributes = METRICAS[metrica].attributes;
        // Verificar se todos os atributos necessários têm valores válidos
        const missingAttributes = attributes.filter(attr => teamData[attr] === undefined);
        if (missingAttributes.length === 0) {
          teamData[metrica] = attributes.reduce((sum, attr) => sum + teamData[attr], 0);
          // Adicionar a métrica normalizada ao objeto do jogador
          teamData[`${metrica}_normalized`] = null; // Inicializar como null para preencher depois
        } else {
          fs.appendFileSync(logFile, `Erro: Os seguintes atributos estão faltando (${missingAttributes.join(', ')}) para o cálculo da métrica ${METRICAS[metrica].name} para ${jogador}, temporada ${season}, time ${team}\n`);
        }
      }
    }
  }
  return data;
}

// Função para normalizar uma métrica entre 0 e 1
function normalizeMetrica(data, metrica, logFile) {
  const metricaValues = [];
  for (const jogador in data) {
    const seasons = data[jogador].Seasons;
    for (const season in seasons) {
      const teams = seasons[season].Teams;
      for (const team in teams) {
        const teamData = teams[team];
        if (teamData[metrica] === null || isNaN(teamData[metrica])) {
          fs.appendFileSync(logFile, `Erro: Valor de ${metrica} é null ou NaN para ${jogador}, temporada ${season}, time ${team}\n`);
          continue;
        }
        metricaValues.push(teamData[metrica]);
      }
    }
  }
  const validMetricaValues = metricaValues.filter(value => !isNaN(value));
  if (validMetricaValues.length === 0) {
    fs.appendFileSync(logFile, `Erro: Nenhum valor de ${metrica} válido encontrado para normalização\n`);
    return data;
  }
  const min = ss.min(validMetricaValues);
  const max = ss.max(validMetricaValues);
  for (const jogador in data) {
    const seasons = data[jogador].Seasons;
    for (const season in seasons) {
      const teams = seasons[season].Teams;
      for (const team in teams) {
        const teamData = teams[team];
        if (teamData[metrica] === null || isNaN(teamData[metrica])) {
          fs.appendFileSync(logFile, `Erro: Valor de ${metrica} é null ou NaN para ${jogador}, temporada ${season}, time ${team}\n`);
          continue;
        }
        teamData[`${metrica}_normalized`] = (teamData[metrica] - min) / (max - min);
      }
    }
  }
  return data;
}

// Ler os dados do arquivo JSON
const jsonData = fs.readFileSync('playerStatsWithZScores.json');
const data = JSON.parse(jsonData);

// Nome do arquivo de log
const logFile = 'errorLog.txt';

// Adicionar e normalizar todas as métricas ao arquivo JSON
for (const metrica in METRICAS) {
  addMetrica(data, metrica, logFile);
  normalizeMetrica(data, metrica, logFile);
}

// Salvar os dados atualizados em um novo arquivo JSON
fs.writeFileSync('playerStatsWithMetrics.json', JSON.stringify(data, null, 2));

console.log(`As métricas foram adicionadas e normalizadas com sucesso no arquivo "playerStatsWithMetrics.json"!`);
