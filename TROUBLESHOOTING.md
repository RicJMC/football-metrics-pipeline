# Troubleshooting Guide

## Common Issues and Solutions

### When Using the Template

#### 1. "Project directory already exists"

**Error:** `Error: Project directory already exists: /path/to/project`

**Cause:** The target directory already contains a project with that name.

**Solution:**
```bash
# Option A: Use a different name
bash scripts/new-from-template.sh my-project-v2

# Option B: Delete the existing directory (if safe)
rm -rf /path/to/project
bash scripts/new-from-template.sh my-project

# Option C: Use a different target directory
bash scripts/new-from-template.sh my-project /tmp
```

---

#### 2. "Target directory does not exist"

**Error:** `Error: Target directory does not exist: /nonexistent/path`

**Cause:** The directory you specified doesn't exist.

**Solution:**
```bash
# Create the directory first
mkdir -p /path/to/projects
bash scripts/new-from-template.sh my-project /path/to/projects

# Or use an existing directory
bash scripts/new-from-template.sh my-project /home/user
```

---

#### 3. Script fails to copy template

**Error:** `cp: cannot copy: Permission denied`

**Cause:** You don't have read permissions on the template directory or write permissions in the target.

**Solution:**
```bash
# Check permissions on template
ls -ld /path/to/copilot-ai-starter
# Should show: drwxr-xr-x (755) or similar

# Check write permissions on target
ls -ld /path/to/projects
# Should show write permission (w) for your user

# If target is read-only, use a different directory
bash scripts/new-from-template.sh my-project ~/projects
```

---

### When Customizing the Template

#### 4. "verify.sh fails after customization"

**Error:** `[fail] <some check> failed`

**Cause:** You modified files but `verify.sh` still expects the original structure.

**Solution:**

1. **Identify what failed:**
   ```bash
   bash scripts/verify.sh
   # Read the [fail] lines
   ```

2. **Common failures:**
   - **Missing required files:** Create or rename the file
   - **JSON parse error:** Check JSON syntax with `python3 -m json.tool file.json`
   - **Shell syntax error:** Check with `bash -n scripts/your-script.sh`
   - **Python test failure:** Run tests manually: `cd backend/python && python3 -m pytest -v`

3. **Adapt verify.sh for your project:**
   ```bash
   # If your project doesn't use Python backend:
   nano scripts/verify.sh
   # Remove the line:   "${ROOT_DIR}/backend/python/..."
   # Add your project's required files
   ```

---

#### 5. "agents/designer.agent.md or implementer.agent.md feels generic"

**Issue:** The agents don't reflect your specific project domain.

**Solution:** Customize the agents to your domain:

```bash
# Edit designer agent (for planning)
nano .github/agents/designer.agent.md
```

Example customization for a data pipeline project:

```markdown
---
name: designer
description: Designs ETL pipelines, data schemas, and validation patterns
tools: [read, search, grep, edit]
---
# Designer Agent — Data Pipeline

## Responsibilities
- Propose ETL pipeline stages and data flow
- Draft data schema documentation
- Improve validation and error handling patterns
- Design monitoring and alerting for pipeline stages

## Constraints
- Transformations must be idempotent (safe to retry)
- All transformations must be tested with sample data
- Schema changes require migration documentation
- No direct database modifications without approval

## Output Format
1. Pipeline design intent
2. Proposed schema changes
3. Validation strategy
4. Risk assessment and mitigation
```

---

#### 6. "I want to use a different backend language (not Python)"

**Issue:** The template includes a Python backend, but you want Node.js, Go, Rust, etc.

**Solution:**

1. **Remove Python backend:**
   ```bash
   rm -rf backend/python
   ```

2. **Create your language's backend:**
   ```bash
   mkdir -p backend/nodejs
   cd backend/nodejs
   npm init -y
   # ... set up your project
   ```

3. **Update verify.sh** to validate your language instead of Python:
   ```bash
   nano scripts/verify.sh
   ```

   Remove these lines:
   ```bash
   if python3 --version >/dev/null 2>&1; then
     echo "[verify] python: $(python3 --version 2>&1)"
     ...
   fi
   ```

   Add for Node.js:
   ```bash
   if command -v npm >/dev/null 2>&1; then
     echo "[verify] npm: $(npm --version)"
     (cd "${ROOT_DIR}/backend/nodejs" && npm test) || {
       echo "[fail] npm test failed"
       FAIL=1
     }
   fi
   ```

4. **See [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)** for language-specific examples.

---

#### 7. "GitHub requires 2FA but gh CLI can't connect"

**Error:** `Error: authentication required but failed` or similar from `gh` CLI

**Solution:**

1. **Authenticate with gh:**
   ```bash
   gh auth login
   ```

2. **Choose protocol:** HTTPS (recommended) or SSH
   - HTTPS: uses `gh` credentials (simpler)
   - SSH: uses SSH keys (more secure for automation)

3. **Complete authentication:**
   - Follow prompts
   - You may need to use a personal access token

4. **Create repo without gh CLI:**
   ```bash
   # Use GitHub web UI to create the repo, then:
   git remote add origin https://github.com/YOUR_USERNAME/my-project.git
   git branch -M main
   git push -u origin main
   ```

---

### When Using Copilot Agents

#### 8. "@designer or @implementer agents don't recognize my project"

**Issue:** You run `@designer` but get generic or irrelevant responses.

**Solution:**

1. **Ensure guardrails are clear:**
   ```bash
   cat .github/copilot-instructions.md
   ```
   Check that it describes your project's purpose and constraints.

2. **Update `.github/agents/designer.agent.md`** with specific `Responsibilities`:
   ```markdown
   ## Responsibilities
   - [Your specific task 1]
   - [Your specific task 2]
   - [Your specific task 3]
   ```

3. **Give the agent context in your prompt:**
   ```
   @designer I'm building a REST API. What's a good folder structure
   for handlers, middlewares, and utilities? See my project structure
   in README.md for reference.
   ```

4. **Review the agent's constraints** — they might be too strict:
   ```bash
   cat .github/agents/implementer.agent.md
   ```
   If constraints are preventing useful suggestions, make them more specific to your needs.

---

#### 9. "Copilot keeps suggesting code that violates my guardrails"

**Issue:** The agent ignores constraints in `.github/copilot-instructions.md`.

**Solution:**

1. **Make guardrails more explicit:**
   ```bash
   nano .github/copilot-instructions.md
   ```

   Instead of:
   ```markdown
   - Keep changes minimal
   ```

   Write:
   ```markdown
   - Keep changes minimal: max 50 lines per file, avoid refactoring unrelated code
   - Never run `rm` or destructive commands without explicit user approval
   - No database schema changes without a migration file
   ```

2. **Reference guardrails in your prompt:**
   ```
   @implementer Please add a POST endpoint. Remember:
   - Follow the guardrails in .github/copilot-instructions.md
   - Add tests in tests/
   - No hardcoded secrets
   ```

3. **Review agent scope:**
   If `@implementer` keeps doing risky things, see:
   ```bash
   cat .github/agents/implementer.agent.md
   ```

4. **Reset context:**
   In Copilot Chat, sometimes starting a new thread helps:
   - Copilot may accumulate context from prior messages
   - A fresh thread refreshes guidelines

---

### When Setting Up CI/CD

#### 10. "GitHub Actions workflow doesn't run on push"

**Error:** No CI job appears in GitHub Actions after pushing.

**Solution:**

1. **Check workflow file exists and is valid:**
   ```bash
   cat .github/workflows/ci.yml
   ```

2. **Check workflow syntax:**
   ```bash
   # Use an online validator or:
   python3 -m json.tool .github/workflows/ci.yml 2>&1 | head -20
   ```

3. **Check branch name:**
   - Workflows run on `main` by default
   - Make sure you're pushing to `main` or a branch matching the trigger
   ```bash
   git branch
   # Should show: * main
   ```

4. **Check repository settings:**
   - Go to GitHub: Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" or similar is enabled

5. **Trigger workflow manually (for testing):**
   ```bash
   gh workflow run ci.yml
   ```

---

#### 11. "verify.sh passes locally but fails in CI"

**Issue:** `bash scripts/verify.sh` works on your machine but fails in GitHub Actions.

**Cause:** Different environment (Python version, missing tools, etc.)

**Solution:**

1. **Check Python version:**
   ```bash
   # Local:
   python3 --version
   # CI uses what? Check .github/workflows/ci.yml
   ```

2. **Ensure dependencies are installed:**
   ```bash
   # If using pytest:
   pip install pytest
   # If using mypy:
   pip install mypy
   ```

3. **Check for environment-specific issues:**
   - Windows vs. Linux line endings
   - Path separators (`/` vs `\`)
   - Environment variables

4. **Add debugging to CI:**
   ```bash
   # Edit .github/workflows/ci.yml
   # Add before verify.sh:
   - name: Debug info
     run: |
       echo "Python: $(python3 --version)"
       echo "Bash: $(bash --version | head -1)"
       # ... more debug info
   ```

---

### When Publishing Your Adapted Template

#### 12. "I want to publish my customized template as a public repository"

**Issue:** How do I share my adapted template with others?

**Solution:**

1. **Ensure no secrets are in the repo:**
   ```bash
   bash scripts/verify.sh  # Should pass
   git log -p --all -S 'password\|secret\|API_KEY' | head -20
   # Should return nothing
   ```

2. **Update README.md** to reflect your template (not the original):
   ```bash
   nano README.md
   # Add your domain-specific info (e.g., ML, APIs, data pipelines)
   ```

3. **Update TEMPLATE_USAGE.md** (or create your own) with:
   - Your specific customizations
   - Examples relevant to your domain
   - How to further customize for specific projects

4. **Make it public:**
   ```bash
   gh repo edit --visibility public
   # Or via GitHub UI: Settings → Danger Zone → Change visibility
   ```

5. **Add a LICENSE:**
   ```bash
   # MIT License (or your choice)
   touch LICENSE
   # Add license text
   git add LICENSE
   git commit -m "Add MIT License"
   git push
   ```

---

### General Debugging Tips

#### Check project structure:
```bash
tree -L 2  # or use find if tree not available
find . -maxdepth 2 -type d | sort
```

#### Validate key files:
```bash
# JSON files
python3 -m json.tool .vscode/settings.json

# Shell scripts
bash -n scripts/verify.sh

# Python (if using)
python3 -m py_compile src/**/*.py
```

#### Review git history for mistakes:
```bash
git log --oneline | head -20
git diff HEAD~1  # See last commit changes
```

#### Check file permissions:
```bash
ls -la scripts/
# Should show: -rwxr-xr-x for executable scripts
```

---

## Getting Help

If you encounter an issue not covered here:

1. **Check documentation:**
   - [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) — Customization guide
   - [SECURITY.md](SECURITY.md) — Threat model and constraints
   - [README.md](README.md) — Project overview
   - `docs/decisions/` — Design decisions

2. **Review guardrails:**
   - `.github/copilot-instructions.md` — Global rules
   - `.github/agents/` — Agent definitions

3. **Check agent output:**
   - Ask `@designer` to explain the structure
   - Ask `@implementer` what it's trying to do

4. **Run verification:**
   ```bash
   bash scripts/verify.sh
   ```

5. **Check GitHub Actions logs:**
   - Go to your repo → Actions → Latest workflow
   - Read the full log to see where CI failed

---

## Quick Reference: Common Commands

```bash
# Verify project integrity
bash scripts/verify.sh

# Create new project from template
bash scripts/new-from-template.sh my-project

# Run Python backend (if present)
cd backend/python
python3 -m app.server

# Run tests
cd backend/python
python3 -m pytest -v

# Check git status before pushing
git status
git diff

# Make a feature branch
git checkout -b feature/my-change

# Create a pull request
gh pr create --fill

# Authenticate with GitHub
gh auth login
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-28  
**Related:** [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md), [SECURITY.md](SECURITY.md), [README.md](README.md)
