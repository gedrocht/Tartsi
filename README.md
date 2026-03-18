# Tartsi

This repository starts with a hardened GitHub baseline focused on strict quality gates, security scanning, repository policy validation, and reproducible local checks.

## Local checks

```bash
python -m pip install -r requirements-dev.txt
pytest
```

## GitHub protections this repository expects

- Required status checks from the workflows in `.github/workflows/`
- Branch protection on the default branch
- At least one approving review
- Signed commits if your organization requires them

