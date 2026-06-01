# Documentation Map

This document provides a structured guide to all documentation in this project. Choose your path based on your goal.

---

## 📍 Quick Navigation by Goal

### I want to **understand what this project is**
1. Start: [README.md](README.md) — Overview (5 min read)
2. Then: [QUICKSTART.md](QUICKSTART.md) — Onboarding for *this* template (15 min)
3. Reference: [SECURITY.md](SECURITY.md) — How it's safe (10 min)

### I want to **use this template in my own project**
1. Start: [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) — Three ways to reuse (20 min read)
2. Option A (New Project): Use `bash scripts/new-from-template.sh` → follow Step-by-Step guide (1-2 hours)
3. Option B (Existing Project): Follow "Selective Integration" guide (1-2 hours)
4. Reference: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — If something breaks (lookup as needed)

### I want to **understand the design decisions**
1. Read: [docs/decisions/](docs/decisions/) — Architecture Decision Records (ADRs) (15-30 min each)
   - ADR-001: Minimal CI Without Deployment
   - ADR-002: Branch Protection and Merge Rules
   - ADR-003: Copilot Guardrails and Safety

### I want to **work with Copilot agents**
1. Start: [QUICKSTART.md](QUICKSTART.md) — Section "Your First Interaction" (5 min)
2. Reference: [.github/copilot-instructions.md](.github/copilot-instructions.md) — Global guardrails (5 min)
3. Reference: [.github/agents/](https://github.com/RicJMC/copilot-ai-starter/tree/main/.github/agents) — Agent definitions (5 min each)
4. Learn: Use `@designer` and `@implementer` in Copilot Chat

### I have a **problem or error**
1. Start: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Common issues (lookup by symptom)
2. If not found: Check [docs/decisions/](docs/decisions/) for design context
3. Still stuck: Re-read the relevant section of [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)

### I want to **adapt this template for my domain** (ML, APIs, data pipelines, etc.)
1. Read: [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) — Section "Customizing Agents and Instructions" (10 min)
2. Example: See language-specific examples in [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) — Section "Adapting verify.sh for Different Languages"
3. Customize: Edit `.github/agents/`, `.github/copilot-instructions.md`, `scripts/verify.sh` for your domain
4. Validate: Run `bash scripts/verify.sh` locally

### I want to **understand the security model**
1. Start: [SECURITY.md](SECURITY.md) — Full threat model (20 min)
2. Reference: [GOVERNANCE.md](GOVERNANCE.md) — Code review workflow (5 min)
3. Technical: [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) (10 min)

---

## 📚 All Documents by Category

### Getting Started (New Users)
| Document | Time | Purpose |
|----------|------|---------|
| [README.md](README.md) | 5 min | Project overview, what this is and why |
| [QUICKSTART.md](QUICKSTART.md) | 15 min | Onboarding: setup, first steps, workflow |
| [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) | 20 min | How to use template in your projects (3 options) |

### Troubleshooting & Help
| Document | Time | Purpose |
|----------|------|---------|
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 5-15 min | 12 common issues and solutions |
| [QUICKSTART.md#common-questions](QUICKSTART.md) | 5 min | FAQ for this template |
| [TEMPLATE_USAGE.md#faq](TEMPLATE_USAGE.md) | 5 min | FAQ for template reuse |

### Design & Architecture
| Document | Time | Purpose |
|----------|------|---------|
| [SECURITY.md](SECURITY.md) | 20 min | Threat model, design principles, constraints |
| [GOVERNANCE.md](GOVERNANCE.md) | 5 min | Code review workflow and approval policies |
| [docs/decisions/001-minimal-ci-without-deployment.md](docs/decisions/001-minimal-ci-without-deployment.md) | 10 min | Why minimal CI (no deployment) |
| [docs/decisions/002-branch-protection-and-merge-rules.md](docs/decisions/002-branch-protection-and-merge-rules.md) | 10 min | Why branch protection and merge rules |
| [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) | 10 min | Why Copilot constraints and how they work |

### Operational Guidance
| File | Purpose |
|------|---------|
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Global rules for Copilot (reference when customizing) |
| [.github/agents/designer.agent.md](.github/agents/designer.agent.md) | Designer agent definition (planning, architecture) |
| [.github/agents/implementer.agent.md](.github/agents/implementer.agent.md) | Implementer agent definition (execution, validation) |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | GitHub Actions CI workflow |
| [scripts/verify.sh](scripts/verify.sh) | Validation script (customizable for your project) |
| [scripts/new-from-template.sh](scripts/new-from-template.sh) | Helper script for Option A (copy-and-adapt) |

### Backend & Code
| File | Purpose |
|------|---------|
| [backend/python/pyproject.toml](backend/python/pyproject.toml) | Python dependencies and metadata |
| [backend/python/src/app/server.py](backend/python/src/app/server.py) | Minimal HTTP server stub |
| [backend/python/tests/test_smoke.py](backend/python/tests/test_smoke.py) | Smoke tests example |

---

## 🗺️ Reading Paths by User Type

### New User (First Time)
**Goal:** Understand what this is and how to use it  
**Time:** 30 minutes  
**Path:**
1. [README.md](README.md) (5 min)
2. [QUICKSTART.md](QUICKSTART.md) - Full read (15 min)
3. Try: `bash scripts/verify.sh` (2 min)
4. Reference: [SECURITY.md](SECURITY.md) - Section "Quick Summary" only (3 min)
5. Explore: `.github/agents/` and `.github/copilot-instructions.md` (5 min)

### Template Reuser (Starting New Project)
**Goal:** Create a new project from this template  
**Time:** 2-4 hours (mostly implementation, not reading)  
**Path:**
1. [README.md](README.md) (5 min)
2. [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) - Full read (20 min)
3. Run: `bash scripts/new-from-template.sh my-project` (1 min)
4. Customize: Follow [TEMPLATE_USAGE.md#option-a-step-2](TEMPLATE_USAGE.md) (1-2 hours)
5. Reference: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if needed (5-15 min)
6. Verify: `bash scripts/verify.sh` (1 min)
7. Commit and push (5 min)

### Existing Project Enhancer (Adding Guardrails)
**Goal:** Add Copilot guardrails to existing project  
**Time:** 1-3 hours (depending on project complexity)  
**Path:**
1. [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) - Section "Option B" (15 min read)
2. Copy files: Follow steps (15 min)
3. Customize: `scripts/verify.sh`, `.github/copilot-instructions.md`, agents (1-2 hours)
4. Validate: `bash scripts/verify.sh` (2 min)
5. Reference: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues (5-15 min)

### Security Reviewer
**Goal:** Understand security model and threat mitigations  
**Time:** 45 minutes  
**Path:**
1. [SECURITY.md](SECURITY.md) - Full read (20 min)
2. [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) (10 min)
3. Review: [.github/copilot-instructions.md](.github/copilot-instructions.md) (5 min)
4. Review: [GOVERNANCE.md](GOVERNANCE.md) (5 min)
5. Check: `scripts/verify.sh` for validation logic (5 min)

### Architect (Understanding Design)
**Goal:** Learn why the project is structured this way  
**Time:** 1 hour  
**Path:**
1. [README.md](README.md) (5 min)
2. [docs/decisions/](docs/decisions/) - Read all 3 ADRs (30 min)
3. [SECURITY.md](SECURITY.md) - Sections "Design Principles" and "Threat Model" (15 min)
4. [GOVERNANCE.md](GOVERNANCE.md) (5 min)

---

## 📖 Topic Index

### By Technical Topic

**Copilot Integration**
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Guardrails
- [.github/agents/](https://github.com/RicJMC/copilot-ai-starter/tree/main/.github/agents) — Agent definitions
- [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) — Design rationale

**CI/CD & Validation**
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — GitHub Actions workflow
- [scripts/verify.sh](scripts/verify.sh) — Validation script
- [docs/decisions/001-minimal-ci-without-deployment.md](docs/decisions/001-minimal-ci-without-deployment.md) — Why minimal CI

**Branch Management & Review**
- [GOVERNANCE.md](GOVERNANCE.md) — Code review workflow
- [docs/decisions/002-branch-protection-and-merge-rules.md](docs/decisions/002-branch-protection-and-merge-rules.md) — Why branch protection

**Security & Threat Model**
- [SECURITY.md](SECURITY.md) — Full security policy
- [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) — Specific to Copilot safety

**Template Reuse & Customization**
- [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) — How to adapt for other projects
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Common adaptation issues
- [scripts/new-from-template.sh](scripts/new-from-template.sh) — Automated copy script

---

## 🔍 Finding Information

### "How do I...?"

| Question | Answer |
|----------|--------|
| ...get started? | → [QUICKSTART.md](QUICKSTART.md) |
| ...use this template in my project? | → [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) |
| ...fix a problem? | → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| ...customize verify.sh? | → [TEMPLATE_USAGE.md#customizing-verifys-for-different-languages](TEMPLATE_USAGE.md) |
| ...customize agents? | → [TEMPLATE_USAGE.md#customizing-github-instructions-for-your-domain](TEMPLATE_USAGE.md) |
| ...work with Copilot? | → [QUICKSTART.md#working-with-agents](QUICKSTART.md) |
| ...set up branch protection? | → [GOVERNANCE.md](GOVERNANCE.md) or [docs/decisions/002-branch-protection-and-merge-rules.md](docs/decisions/002-branch-protection-and-merge-rules.md) |
| ...understand the threat model? | → [SECURITY.md](SECURITY.md) |

### "Why...?"

| Question | Answer |
|----------|--------|
| ...is there no deployment? | → [docs/decisions/001-minimal-ci-without-deployment.md](docs/decisions/001-minimal-ci-without-deployment.md) |
| ...is branch protection required? | → [docs/decisions/002-branch-protection-and-merge-rules.md](docs/decisions/002-branch-protection-and-merge-rules.md) |
| ...are there guardrails for Copilot? | → [docs/decisions/003-copilot-guardrails-and-safety.md](docs/decisions/003-copilot-guardrails-and-safety.md) or [SECURITY.md](SECURITY.md) |

---

## 📋 Document Metadata

| Document | Lines | Type | Updated |
|----------|-------|------|---------|
| README.md | ~230 | Guide | 2026-05-28 |
| QUICKSTART.md | ~190 | Guide | 2026-05-28 |
| TEMPLATE_USAGE.md | ~600 | Reference | 2026-05-28 |
| TROUBLESHOOTING.md | ~450 | Reference | 2026-05-28 |
| SECURITY.md | ~200 | Policy | 2026-05-28 |
| GOVERNANCE.md | ~50 | Policy | 2026-05-10 |
| docs/decisions/ | ~300 | Architecture | 2026-05-10 |

---

## 🎯 Navigation Tips

1. **Bookmark the relevant sections** for your role (New User, Reuser, Reviewer, etc.)
2. **Use Ctrl+F** to search within documents
3. **Follow links** (blue text) to jump between documents
4. **Read in order** when you see numbered lists (→ means "then read")
5. **Check TROUBLESHOOTING.md first** when something breaks

---

**Last Updated:** 2026-05-28  
**Version:** 1.0
