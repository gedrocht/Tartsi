from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def required_files() -> list[str]:
    return [
        ".editorconfig",
        ".gitattributes",
        ".gitignore",
        "README.md",
        "CONTRIBUTING.md",
        "SECURITY.md",
        "CODEOWNERS",
        "pyproject.toml",
        "requirements-dev.txt",
        ".github/dependabot.yml",
        ".github/pull_request_template.md",
        ".github/ISSUE_TEMPLATE/bug_report.yml",
        ".github/ISSUE_TEMPLATE/feature_request.yml",
        ".github/workflows/ci.yml",
        ".github/workflows/codeql.yml",
        ".github/workflows/repo-health.yml",
    ]


def missing_files() -> list[str]:
    return [path for path in required_files() if not (ROOT / path).exists()]


def validate_codeowners_file() -> bool:
    content = read_text(ROOT / "CODEOWNERS")
    return bool(content.strip()) and "*" in content


def validate_readme_mentions_local_checks() -> bool:
    content = read_text(ROOT / "README.md")
    return "pytest" in content and "requirements-dev.txt" in content


def validate_ci_references_pytest() -> bool:
    content = read_text(ROOT / ".github/workflows/ci.yml")
    return "pytest" in content and "dependency-review-action" in content
