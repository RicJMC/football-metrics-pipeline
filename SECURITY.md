# Security Policy

## Overview

`copilot-ai-starter` is a private portfolio project demonstrating safe, idempotent, and validation-driven practices for AI-assisted development workflows with GitHub Copilot.

This document describes the security posture, known constraints, and best practices for using this project.

## Scope

This repository is **not production infrastructure**. It is:
- A reference template for Copilot integration
- A demonstration of operational discipline
- A learning resource for safe AI automation

It is not:
- A deployment tool for critical systems
- A framework for handling sensitive data
- A security compliance tool

## Design Principles

### 1. Least Privilege
- Agents have only the permissions they need for their role
- No hardcoded secrets, tokens, or credentials
- Read-only access by default; write access requires explicit justification

### 2. Defense in Depth
- Multiple independent safeguards:
  - Agent-level constraints (role definitions)
  - Instruction-level guardrails (operational rules)
  - Repository-level enforcement (branch protection, code review)
  - Infrastructure-level isolation (GitHub-hosted runners only)

### 3. Idempotence
- Operations are safe to repeat
- No destructive commands without explicit approval
- Verification script validates state before and after changes

### 4. Auditability
- All decisions documented in Architecture Decision Records (ADRs)
- Code review via branch protection and CODEOWNERS
- GitHub Actions logs available for all automated actions
- Clear audit trail of who changed what and why

## Known Constraints and Limitations

### Agent Capabilities
- Agents **cannot** directly execute arbitrary shell commands without user approval
- Agents **cannot** access external APIs or credentials
- Agents **cannot** modify guardrail files (`.github/agents/`, `.github/copilot-instructions.md`) without review
- Agents **cannot** run destructive operations (rm, prune, delete) without explicit user confirmation

### CI/CD
- No secrets are used in workflows
- No deployment or access to external systems
- No self-hosted runners (GitHub-hosted only)
- Workflow output is visible in GitHub UI but does not modify repository state beyond running verification

### MCP Servers
- MCP configuration in `.vscode/mcp.json` is a **template only**
- MCP servers are not automatically started
- Any MCP server must be manually reviewed and explicitly approved before activation
- No MCP servers have access to production credentials or internal infrastructure

## Threat Model

### Attack Scenarios Mitigated

**Scenario 1: Agent Hallucination Leading to Destructive Command**
- *Risk*: Copilot agent invents a `rm -rf` command that user doesn't notice
- *Mitigation*: 
  - Agent constraints explicitly prohibit destructive commands
  - `scripts/verify.sh` detects broken state
  - CI requires verification to pass before merge
  - User reviews all agent outputs before approval

**Scenario 2: Accidental Secret Commit**
- *Risk*: Developer commits `.env` file with real credentials
- *Mitigation*:
  - `.gitignore` explicitly excludes `.env`, `.env.local`, etc.
  - Pre-commit verification could catch patterns
  - CI validation checks for obvious secret patterns
  - GitHub secret scanning (if repository becomes public)

**Scenario 3: Malicious Modification of CI Workflow**
- *Risk*: Attacker or compromised account modifies `.github/workflows/ci.yml` to exfiltrate secrets
- *Mitigation*:
  - CODEOWNERS requires review by RicJMC
  - Branch protection requires CI to pass (chicken-and-egg, but caught on review)
  - Workflow itself uses only `permissions: contents: read`
  - No secrets available to the workflow to exfiltrate

**Scenario 4: Supply Chain Compromise of a Dependency**
- *Risk*: Malicious version of `pytest` or other package installed
- *Mitigation*:
  - No dependencies in main project (uses Python standard library only)
  - Backend `pyproject.toml` has explicit, minimal dependencies
  - Virtual environment isolates dependencies
  - Could add lock files and package verification in future

### Attack Scenarios NOT Addressed

**Scenario A: Compromised GitHub Account**
- If the RicJMC GitHub account is compromised, an attacker can modify anything in this repository
- *Mitigation outside this project*: Use strong authentication (2FA), monitor account activity, revoke compromised tokens

**Scenario B: Compromised Personal Computer**
- If the developer's local machine is compromised, an attacker can make arbitrary commits
- *Mitigation outside this project*: Keep OS and tools updated, use antivirus/malware scanning, monitor git config

**Scenario C: Supply Chain Attack on GitHub Actions**
- If GitHub Actions runners are compromised at the infrastructure level, workflows could be affected
- *Mitigation outside this project*: Trust GitHub's infrastructure security (industry standard)

**Scenario D: Exposure of Unmasked Secrets in Logs**
- If a developer accidentally runs a command in CI that prints a secret, it could be visible in logs
- *Mitigation*: Never use secrets in CI for this project; keep all sensitive data out of version control

## Best Practices for Using This Project

### For Developers

1. **Always run `scripts/verify.sh` locally before pushing**
   ```bash
   bash scripts/verify.sh
   ```

2. **Never commit real `.env` files or credentials**
   - Use `.env.example` as a template
   - Keep all real credentials in `.env.local` (not tracked)

3. **Review agent outputs carefully**
   - Do not blindly accept Copilot suggestions
   - Understand what each agent is doing
   - Question any command that seems unusual

4. **Use branches for all changes**
   - Never commit directly to `main`
   - Create a feature branch, push it, and open a PR
   - Let CI validate before merging

5. **Keep guardrail files under review**
   - Periodically audit `.github/agents/` and `.github/copilot-instructions.md`
   - Ensure constraints are still appropriate
   - Update documentation if capabilities change

### For Code Review

When reviewing PRs or changes:

1. Check that CI passed
2. Verify no secrets were accidentally committed (grep for patterns)
3. If workflow files were changed, pay extra attention
4. Ensure changes align with decision records in `docs/decisions/`

### For Portfolio Reviewers

This project demonstrates:
- **Operational Maturity**: CI/CD, branch protection, verification
- **Security-First Design**: explicit constraints, least privilege, defense in depth
- **Engineering Documentation**: Architecture Decision Records, clear rationale
- **Responsible AI**: guardrails and human approval gates for automated actions

You can trust that changes to this repository have been validated, reviewed, and documented.

## Reporting Security Issues

If you discover a security vulnerability or have concerns:

1. **Do not** open a public issue
2. Contact: RicJMC via GitHub messaging or email
3. Provide detailed description of the issue
4. Allow time for a response and fix before public disclosure

## Future Improvements

Potential enhancements to this security posture:

- [ ] Pre-commit hooks to catch secret patterns locally
- [ ] Lock files for Python dependencies (including dev/test dependencies)
- [ ] SBOM (Software Bill of Materials) generation
- [ ] Integration with GitHub's secret scanning
- [ ] Signed commits (GPG or SSH key)
- [ ] Automated dependency updates with Dependabot
- [ ] Formal threat modeling workshop with stakeholders (if project expands)

## References

- [OWASP AI Security](https://owasp.org/www-project-ai-security/)
- [GitHub Security Lab: Preventing Pwn Requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [GitHub Best Practices for Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)

---

**Last Updated:** 2026-05-28  
**Version:** 1.0
