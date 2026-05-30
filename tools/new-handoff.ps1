$ErrorActionPreference = 'Stop'

$handoffDir = Join-Path '.github/internal/handoffs' ''
if (-not (Test-Path $handoffDir)) {
  New-Item -ItemType Directory -Path $handoffDir -Force | Out-Null
}

$date = Get-Date -Format 'yyyy-MM-dd'
$file = Join-Path $handoffDir ("$date-session-handoff.md")

if (Test-Path $file) {
  Write-Host "Handoff already exists for today: $file"
  exit 0
}

@"
# Handoff: $date

## Context

## What changed

## Commands run

## Current state

## Problems found

## Next steps

## Risks / warnings

## Memory candidates

- [ ] Incident?
- [ ] ADR?
- [ ] Recurring error?
- [ ] Lesson learned?
"@ | Out-File -Encoding UTF8 $file

Write-Host "Created $file"