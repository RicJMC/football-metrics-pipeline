# fbref-webscrap

Legacy football scraping + ETL project under incremental modernization.

## Current status

- Legacy pipeline preserved (no refactor in Phase 1)
- Repository quarantine/bootstrap in progress
- Generated bulk data and logs are being kept out of Git tracking
- Synthetic sample data and characterization tests now protect the Phase 2 ETL path
- Minimal repository verification is available through `npm run verify`

## Canonical commands (current flow)

From repository root:

```bash
npm run scrape:all
npm run etl
npm run test:characterization
npm run verify
```

Full sequence:

```bash
npm run pipeline
```

## Main entry points

- Scrapers: individual scripts under `scrappe/` in manual legacy mode
- ETL: `index.js` from the repository root
- Legacy scripts-directory launcher: `scripts/index.js`
- Characterization harness: `test/characterization/phase2PipelineHarness.js`

## Modernization order

1. Quarantine + safe bootstrap
2. Documentation baseline
3. Sample data + characterization tests
4. Lint/format + CI
5. Incremental refactor and optional TypeScript migration

See [docs/INVENTORY.md](docs/INVENTORY.md), [docs/MODERNIZATION_PLAN.md](docs/MODERNIZATION_PLAN.md), and [docs/PUBLISHING_CHECKLIST.md](docs/PUBLISHING_CHECKLIST.md).
