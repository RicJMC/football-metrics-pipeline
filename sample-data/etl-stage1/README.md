# Stage 1 ETL sample data

Mocked `data/` tree exercising `scripts/playerStats01_unicos.js`.

## Layout

```
data/
  24-Serie-A/2024/
    standard/   shooting/   passing/   misc/
  32-Primeira-Liga/2023-2024/
    standard/   shooting/   passing/   misc/
expected/
  playerStats01_Unicos.expected.json
```

- Two leagues × one season × four FBref categories × three synthetic players.
- All values are synthetic. They mirror the field layout of real FBref tables
  enough to drive the merge logic in stage 1, but the numbers are not meant to
  look like realistic football statistics.

## Regenerating

Both the data tree and the expected output are produced by:

```bash
node scripts/internal/build-stage1-fixture.js
```

Edit the generator (not the JSON files) when changing the fixture.

## Why only four categories

`playerStats01_unicos.js` iterates over a hard-coded list of eight categories
and silently skips files that do not exist. Including only four categories
keeps the fixture compact while still exercising the per-category merge path.
