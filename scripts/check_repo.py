from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def required_files() -> list[str]:
    return [
        ".editorconfig",
        ".gitattributes",
        ".gitignore",
        "LICENSE",
        "README.md",
        "CONTRIBUTING.md",
        "SECURITY.md",
        "CODEOWNERS",
        "package.json",
        "pyproject.toml",
        "requirements-dev.txt",
        "index.html",
        "playwright.config.ts",
        "typedoc.json",
        "src/App.tsx",
        "src/components/MagicCircleWorkbench.tsx",
        "src/domain/magicCircleGenerator.ts",
        "src/domain/waveFunctionCollapseEngine.ts",
        "src/test/magicCircleGenerator.test.ts",
        "documentation-site/index.md",
        "documentation-site/.vitepress/config.ts",
        "wiki/docker-compose.yml",
        "wiki/data/pages/start.txt",
        ".github/dependabot.yml",
        ".github/pull_request_template.md",
        ".github/ISSUE_TEMPLATE/bug_report.yml",
        ".github/ISSUE_TEMPLATE/feature_request.yml",
        ".github/ISSUE_TEMPLATE/config.yml",
        ".github/workflows/ci.yml",
        ".github/workflows/codeql.yml",
        ".github/workflows/repo-health.yml",
        ".github/workflows/pages.yml",
    ]


def missing_files() -> list[str]:
    return [path for path in required_files() if not (ROOT / path).exists()]


def validate_codeowners_file() -> bool:
    content = read_text(ROOT / "CODEOWNERS")
    return bool(content.strip()) and "*" in content


def validate_readme_mentions_local_checks() -> bool:
    content = read_text(ROOT / "README.md")
    return (
        "pytest" in content
        and "requirements-dev.txt" in content
        and "GitHub Pages" in content
        and "DokuWiki" in content
    )


def validate_ci_references_frontend_quality() -> bool:
    content = read_text(ROOT / ".github/workflows/ci.yml")
    required_snippets = [
        "python -m pytest tests/test_repository.py",
        "npm run lint",
        "npm run typecheck",
        "npm run test",
        "npm run test:e2e",
        "dependency-review-action",
    ]
    return all(required_snippet in content for required_snippet in required_snippets)


def validate_pages_workflow() -> bool:
    content = read_text(ROOT / ".github/workflows/pages.yml")
    required_snippets = [
        "actions/configure-pages",
        "npm run docs:api",
        "npm run docs:site:build",
        "npm run pages:build",
        "actions/deploy-pages",
    ]
    return all(required_snippet in content for required_snippet in required_snippets)


def validate_package_json_scripts() -> bool:
    package_json_content = json.loads(read_text(ROOT / "package.json"))
    scripts = package_json_content.get("scripts", {})
    required_script_names = [
        "build",
        "lint",
        "typecheck",
        "test",
        "test:e2e",
        "docs:api",
        "docs:site:build",
        "pages:build",
        "quality:verify",
    ]
    return all(required_script_name in scripts for required_script_name in required_script_names)
