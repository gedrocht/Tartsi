from pathlib import Path

from scripts import check_repo


ROOT = Path(__file__).resolve().parent.parent


def test_required_files_exist() -> None:
    assert check_repo.missing_files() == []


def test_codeowners_exists_with_default_rule() -> None:
    assert check_repo.validate_codeowners_file()


def test_readme_describes_local_checks() -> None:
    assert check_repo.validate_readme_mentions_local_checks()


def test_ci_runs_pytest_and_dependency_review() -> None:
    assert check_repo.validate_ci_references_pytest()


def test_workflows_pin_major_action_versions() -> None:
    workflow_dir = ROOT / ".github" / "workflows"
    workflows = list(workflow_dir.glob("*.yml"))
    assert workflows, "Expected GitHub workflows to exist."

    for workflow in workflows:
        content = workflow.read_text(encoding="utf-8")
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("uses:"):
                assert "@v" in stripped, f"Unversioned action reference in {workflow.name}: {stripped}"
