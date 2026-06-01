# Template Usage Guide

## What This Template Is

`copilot-ai-starter` is a **reusable reference template** for building AI-assisted projects with GitHub Copilot in a structured, safe, and validated way.

It is **not** a finished application or product. Instead, it provides:
- **Operational scaffolding**: folder structure, scripts, workflows
- **Safety guardrails**: instructions that constrain Copilot's behavior
- **Role-based agents**: `designer` (planning) and `implementer` (execution) with explicit constraints
- **Validation framework**: `verify.sh` to catch errors before pushing
- **Documentation patterns**: ADRs (Architecture Decision Records), threat models, governance
- **Best practices reference**: security, testing, CI/CD patterns

## Three Ways to Use This Template

You can use this template in three fundamentally different ways:

### Option A: Copy & Adapt (Complete Template)
**When:** Starting a new project from scratch  
**What you get:** A pre-built, fully functional scaffold that's immediately operational  
**Effort:** 30–60 minutes to customize for your specific project  
**Outcome:** New project inherits all safety practices, structure, and agents

### Option B: Selective Integration (Pick What You Need)
**When:** Adding AI-assisted workflow to an existing project  
**What you get:** Only the pieces you need (agents, verify.sh, guardrails)  
**Effort:** 1–2 hours to integrate and adapt  
**Outcome:** Existing project gains controlled Copilot integration without refactoring

### Option C: Reference & Learn (No Copy)
**When:** Understanding safe Copilot patterns without code reuse  
**What you get:** Knowledge about architecture, security, and operational discipline  
**Effort:** Read docs (ADRs, SECURITY.md, agents) — 2–3 hours  
**Outcome:** You implement similar patterns in your own style, tuned to your project

---

## Option A: Complete Template — Step by Step

### Quick Start (Using Helper Script)

If you're starting from the template repository, use the provided helper script to automate Option A:

```bash
cd /path/to/copilot-ai-starter
bash scripts/new-from-template.sh my-project /path/to/workspace

# Output:
# Project created: /path/to/workspace/my-project
# Next Steps:
#   1. cd /path/to/workspace/my-project
#   2. Customize files (README.md, verify.sh, agents, etc.)
#   3. git add . && git commit
#   4. gh repo create YOUR_USERNAME/my-project --private --source=. --remote=origin --push
```

The script handles Steps 1–3 automatically. Jump to Step 2 in the detailed guide below.

### Prerequisites
- Bash, Git, Python 3.10+
- GitHub account and `gh` CLI (for creating remote repo)
- VS Code (optional, but recommended)

### Step 1: Copy the Template (Remove Git History)

```bash
# Clone or copy the template directory
cd /your/workspace
cp -a /path/to/copilot-ai-starter my-project
cd my-project

# Remove template's git history
rm -rf .git

# Initialize new git repository
git init
git branch -M main
```

**Why remove `.git`?** The template's commit history is not relevant to your project. Starting fresh keeps your repository clean and focused on your own changes.

### Step 2: Customize Core Files

#### 2.1 Update `README.md`

Edit the title and purpose sections:

```markdown
# My Project

<!-- Replace with your project's actual purpose -->
A [brief description of what your project does].

## Purpose

This project provides [specific functionality]:
- Feature 1
- Feature 2
- Feature 3

## Key Features

✅ [Your feature]
✅ [Your feature]
✅ [Your feature]
```

Keep sections on validation, security, and architecture—they apply to any project.

#### 2.2 Update `QUICKSTART.md`

Replace the clone URL with your actual repository:

```bash
git clone https://github.com/YOUR_USERNAME/my-project.git
cd my-project
./scripts/setup.sh && ./scripts/verify.sh
```

Update the "Your First Interaction" section with examples relevant to your codebase.

#### 2.3 Customize `.github/copilot-instructions.md`

Adapt the guardrails to your project's domain:

```markdown
# Copilot Instructions

## Project Context
[Describe what this project does and its constraints]

## Operating Principles
- [Your principle 1]
- [Your principle 2]
- [General principle: never delete user data without confirmation]
- [General principle: no hardcoded secrets]

## Code Change Rules
- [Language-specific rule]
- [Project-specific rule]
```

#### 2.4 Update Agents (`.github/agents/`)

Edit `designer.agent.md` and `implementer.agent.md` to describe your project's specific tasks.

For example, if your project is a data pipeline:

**designer.agent.md:**
```markdown
## Responsibilities
- Propose ETL pipeline structure and transformations
- Draft documentation for data schemas and ingestion processes
- Improve data validation and error handling patterns
```

**implementer.agent.md:**
```markdown
## Responsibilities
- Implement data transformers with idempotent operations
- Add tests for each transformation stage
- Validate data schema compliance before output
```

### Step 3: Adapt Backend (If Applicable)

If your project uses Python:
- Edit `backend/python/pyproject.toml` with your dependencies
- Replace `backend/python/src/app/server.py` with your actual application code
- Update `backend/python/tests/test_smoke.py` with your tests

If your project uses a different language:
- Remove `backend/python/` entirely
- Create `backend/my-language/` with appropriate structure

### Step 4: Customize `scripts/verify.sh`

This is critical. `verify.sh` must validate *your* project, not a generic Python backend.

**Example for a Node.js project:**

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FAIL=0

echo "[verify] root: ${ROOT_DIR}"

# Check required files for YOUR project
required_paths=(
  "${ROOT_DIR}/README.md"
  "${ROOT_DIR}/package.json"
  "${ROOT_DIR}/.github/copilot-instructions.md"
  "${ROOT_DIR}/src/index.js"
  "${ROOT_DIR}/tests/index.test.js"
)

for p in "${required_paths[@]}"; do
  if [[ -e "${p}" ]]; then
    echo "[ok] ${p}"
  else
    echo "[missing] ${p}"
    FAIL=1
  fi
done

# Check JSON validity
echo "[verify] JSON parsing"
if python3 -m json.tool "${ROOT_DIR}/package.json" >/dev/null 2>&1; then
  echo "[ok] json: package.json"
else
  echo "[fail] json: package.json"
  FAIL=1
fi

# Check JavaScript syntax (if eslint is available)
if command -v npm >/dev/null 2>&1; then
  echo "[verify] npm available"
  (cd "${ROOT_DIR}" && npm test) || {
    echo "[fail] npm test failed"
    FAIL=1
  }
else
  echo "[skip] npm not installed"
fi

# Check for obvious secret patterns
echo "[verify] secrets scan"
if grep -r "password\|API_KEY\|SECRET_" "${ROOT_DIR}/src" "${ROOT_DIR}/src" --exclude-dir=node_modules 2>/dev/null; then
  echo "[fail] possible secrets found"
  FAIL=1
else
  echo "[ok] no obvious secrets"
fi

if [[ ${FAIL} -eq 0 ]]; then
  echo "[verify] success"
else
  echo "[verify] failed"
fi

exit ${FAIL}
```

The key points:
1. **Define required paths** for *your* project structure
2. **Validate language-specific files** (package.json, Cargo.toml, go.mod, etc.)
3. **Run language-specific tests** (npm test, cargo test, go test, etc.)
4. **Check for secrets** (always)
5. **Return non-zero exit code on failure** (so CI will catch it)

### Step 5: Create Your Remote Repository

```bash
# Create a new repository on GitHub
gh repo create YOUR_USERNAME/my-project --private --source=. --remote=origin --push
```

Alternatively, use the GitHub UI to create the repo, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/my-project.git
git branch -M main
git push -u origin main
```

### Step 6: Make Your First Commit

```bash
cd my-project
git add .
git commit -m "Initial scaffold: project structure, verification, and Copilot guardrails"
git push origin main
```

### Step 7: Verify Locally

```bash
bash scripts/verify.sh
```

Must return exit code 0. If it fails, fix the issues before pushing.

---

## Option B: Selective Integration — Step by Step

Use this approach if you have an existing project and want to add Copilot guardrails without copying the entire scaffold.

### Step 1: Copy Guardrails and Scripts

```bash
cd /your/existing/project

# Copy Copilot guardrails and agents
cp -r /path/to/copilot-ai-starter/.github .

# Copy verification script
cp /path/to/copilot-ai-starter/scripts/verify.sh scripts/

# Copy security and governance docs
cp /path/to/copilot-ai-starter/{SECURITY.md,GOVERNANCE.md} .
```

### Step 2: Adapt `.github/copilot-instructions.md`

Review the guardrails and ensure they apply to your project:

```bash
nano .github/copilot-instructions.md
```

Key sections to customize:
- **Project context** — describe what your project does
- **Operating principles** — ensure they match your project's domain
- **Code change rules** — remove rules that don't apply; add rules specific to your project

### Step 3: Customize Agents

Edit `.github/agents/designer.agent.md` and `.github/agents/implementer.agent.md`:

```bash
nano .github/agents/designer.agent.md
nano .github/agents/implementer.agent.md
```

Update the `Responsibilities` and `Constraints` sections to reflect your project's specific workflow.

### Step 4: Adapt `scripts/verify.sh`

This is the most project-specific part. Compare your project's needs with the template:

```bash
# See what the template checks
cat /path/to/copilot-ai-starter/scripts/verify.sh

# Edit your copy
nano scripts/verify.sh
```

**Key customizations:**

- **Replace required_paths** with files specific to your project
- **Add language-specific validation** (e.g., `cargo check` for Rust, `mypy` for Python, `tsc` for TypeScript)
- **Add domain-specific checks** (e.g., database migration validity, configuration syntax, API schema validation)
- **Keep the secrets scan** (always)

### Step 5: Test Locally

```bash
bash scripts/verify.sh
```

Fix any issues. This script must pass before you push changes to CI.

### Step 6: Commit and Push

```bash
git add .github/ scripts/verify.sh SECURITY.md GOVERNANCE.md
git commit -m "Add AI-assisted workflow with Copilot guardrails and validation"
git push origin main
```

### Step 7: Enable Branch Protection (Optional, Recommended)

In your GitHub repository settings:
1. Go to **Settings** → **Branches**
2. Add a rule for `main`:
   - Require a pull request before merging
   - Require status checks to pass (CI workflow)
   - Require code review from at least one approver (or from CODEOWNERS)

---

## Option C: Reference & Learn

Read the template's documentation in this order:

1. **[SECURITY.md](SECURITY.md)** — Understand the threat model and design principles
2. **[docs/decisions/](docs/decisions/)** — Read the Architecture Decision Records (ADRs)
3. **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Study the guardrails
4. **[.github/agents/](.github/agents/)** — See how agents are defined
5. **[GOVERNANCE.md](GOVERNANCE.md)** — Learn the review and approval workflow

Then, implement similar patterns in your own project, tailored to your language, domain, and team practices.

---

## Customizing verify.sh for Different Languages

### Python Project

```bash
# Check Python syntax
python3 -m py_compile src/**/*.py

# Run type checking
mypy src/

# Run tests
python3 -m pytest tests/
```

### Node.js Project

```bash
# Check syntax (linting)
npm run lint

# Run type checking (if using TypeScript)
npm run type-check

# Run tests
npm test
```

### Rust Project

```bash
# Check syntax and errors
cargo check

# Run tests
cargo test

# Check for security advisories
cargo audit
```

### C/C++ Project

```bash
# Compile and check for errors
cmake --build build

# Run tests
ctest --test-dir build

# Static analysis (if available)
cppcheck src/
```

### Go Project

```bash
# Format check
go fmt ./...

# Lint
golangci-lint run

# Test
go test ./...
```

---

## Customizing `.github/instructions/` for Your Domain

The `instructions/` directory holds domain-specific guidance for Copilot. Examples:

**For a web API project, create `.github/instructions/api/rest-api.instructions.md`:**

```markdown
# REST API Guidelines

## Endpoint Design
- Use RESTful conventions: GET, POST, PUT, DELETE
- Always validate input; return 400 for invalid requests
- Document request/response schemas in OpenAPI or JSON Schema

## Error Handling
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Include error messages in response body
- Log errors with context (request ID, user ID, timestamp)

## Security
- Validate all inputs (no SQL injection, XSS)
- Use HTTPS in production
- Implement rate limiting for public endpoints
```

**For a data pipeline project, create `.github/instructions/data/etl.instructions.md`:**

```markdown
# ETL Pipeline Guidelines

## Data Transformations
- All transformations must be idempotent (safe to retry)
- Document schema expectations before and after each stage
- Add row-level and column-level validation

## Error Handling
- Log skipped rows with reason
- Implement dead-letter queues for failed records
- Report summary statistics (processed, failed, skipped)
```

---

## Common Adaptations Checklist

- [ ] Rename/update `README.md` with your project description
- [ ] Update `QUICKSTART.md` with your repo URL and first steps
- [ ] Customize `.github/copilot-instructions.md` for your domain
- [ ] Adapt `.github/agents/designer.agent.md` and `implementer.agent.md`
- [ ] Rewrite `scripts/verify.sh` for your language and project structure
- [ ] Create domain-specific `.github/instructions/` files
- [ ] Adapt `.github/workflows/ci.yml` if needed (e.g., add language-specific build steps)
- [ ] Update backend/ structure or remove if not applicable
- [ ] Create your GitHub repository and set up branch protection
- [ ] Make your first commit and verify CI passes
- [ ] Test the `@designer` and `@implementer` agents with a sample task

---

## When to Use Which Option

| Scenario | Option | Reason |
|----------|--------|--------|
| Starting a new project from scratch | A | Full scaffold saves time; everything is pre-structured |
| Adding Copilot to existing project | B | Minimal disruption; keeps existing code intact |
| Learning safe Copilot patterns | C | Avoid unnecessary copying; understand principles first |
| Migrating between projects | A | Faster than B if you need full structure; slower if you have existing code |
| Multi-team adoption | A or B | A for new teams; B for established codebases |

---

## FAQ

**Q: Can I use Option A for a non-Python project?**  
A: Yes. After copying, remove or replace `backend/python/` with your language's structure. Update `verify.sh` accordingly.

**Q: How do I remove parts I don't need?**  
A: After copying (Option A), delete directories you don't need. Remember to update `.gitignore` and `verify.sh` to remove references to them.

**Q: Can I combine Options A and B?**  
A: Yes. Copy Option A, then selectively remove parts you don't need, then integrate Option B practices if needed.

**Q: What if my project uses a different CI/CD platform (GitLab, Bitbucket)?**  
A: The `.github/workflows/` files are GitHub-specific. You'll need to rewrite them for your platform. The guardrails and agents are platform-agnostic and work anywhere.

**Q: How often should I sync with the template?**  
A: You don't need to. Once you've customized the template for your project, it's independent. You can reference the template for new patterns, but you're not expected to stay in sync.

**Q: Can I use this template in a private company?**  
A: Yes. Customize the guardrails, security model, and agents for your company's policies and risk tolerance.

**Q: What if I want to contribute improvements back to the template?**  
A: Fork the original template, make your improvements, and open a pull request. Or keep your improvements in your own project; the template is meant to be forked and adapted.

---

## Next Steps

1. **Choose your option** (A, B, or C)
2. **Follow the step-by-step guide** for your chosen option
3. **Run `scripts/verify.sh`** to ensure your project passes validation
4. **Test with an agent**: Use `@designer` to ask about your project structure
5. **Create a PR** with your first changes and verify CI passes
6. **Read [SECURITY.md](SECURITY.md)** and [docs/decisions/](docs/decisions/) for deeper understanding
7. **Customize agents and instructions** for your specific workflow

---

## Resources

- [Copilot Guidelines](README.md) — Overview of the template
- [Quick Start](QUICKSTART.md) — Onboarding for this project
- [Security Policy](SECURITY.md) — Threat model and best practices
- [Governance](GOVERNANCE.md) — Code review and approval workflows
- [Architecture Decisions](docs/decisions/) — Design rationale
- [GitHub Copilot Docs](https://docs.github.com/en/copilot) — Official documentation
