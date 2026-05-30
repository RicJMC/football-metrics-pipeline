# Edge case fixtures

Small synthetic fixtures that exercise specific scenarios in the legacy ETL
(stages 02 through 05). Each fixture is a stage-2 input (same schema as
`sample-data/etl-phase2/input/playerStats01_Unicos.sample.json`) and has
matching approved outputs in `expected/`.

| Fixture | Scenario |
| --- | --- |
| `missing-fields` | Player with several metric fields set to `null` or absent. Validates that `convertToNumbers` and downstream stages do not crash on partial data. |
| `multi-team` | Same player with two teams in the same season (mid-season transfer). Validates that both team entries survive the pipeline. |
| `filtered-out` | Player whose `minutes_90s` is below the stage-2 threshold (`< 3`). Validates that stage 2 drops the team entry. |

All data is synthetic. Do not treat values as realistic football statistics.
