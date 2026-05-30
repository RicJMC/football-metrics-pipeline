# Handoff — Recovery Summary

## Contexto

Foi feita uma limpeza acidental com `git clean -fd` e depois foi necessário recuperar a base do repositório.

## O que foi feito

1. Foi identificado que o commit de limpeza estava local e ainda não tinha sido enviado.
2. Foi criado um branch de segurança: `backup-before-cleanup-2026-05-29`.
3. Foi executado `git reset --hard HEAD~1` para desfazer o último commit de limpeza.
4. Foi restaurado o [.gitignore](../../.gitignore) com regras para:
   - `data/`
   - `jsonfiles/`
   - `csv/**/*.csv`
   - `scrappe/tmp/`
   - logs e artefactos temporários
   - `.env` e variantes
   - `copilot-ai-starter/`
5. Foram recuperados do histórico local do VS Code os ficheiros de `.github/`, `docs/` e `.env.example`.
6. Foi corrigido um `docs/DATA_POLICY.md` que tinha vindo corrompido do histórico.

## O que foi obtido

Informação confirmada durante a recuperação:

- `main` estava ahead de `origin/main`.
- O commit de limpeza era local.
- A raiz do projeto tinha perdido as pastas `.github/` e `docs/`.
- O histórico local do VS Code ainda continha cópias recuperáveis desses ficheiros.
- O Git não consegue recuperar ficheiros untracked apagados por `git clean` se não existirem noutro histórico/backup.

## O que falta fazer

1. Rever o estado final com `git status`.
2. Confirmar se há ficheiros untracked importantes que ainda faltam recuperar.
3. Verificar OneDrive, Reciclagem do Windows e histórico do VS Code para ficheiros perdidos que não estavam no Git.
4. Criar uma branch de trabalho limpa para a próxima etapa.
5. Fazer commit pequeno e reversível da recuperação.

## Ideia recomendada

Manter o foco em segurança e reversibilidade:

- primeiro estabilizar o repositório;
- depois separar generated data de source code;
- só depois avançar para documentação final, fixtures e testes de caracterização.

## Risco residual

- Ficheiros untracked apagados pelo `git clean -fd` podem não ser recuperáveis se não existirem no VS Code, OneDrive ou backups locais.
- Não foi feita nenhuma alteração à lógica de scraping/ETL.
