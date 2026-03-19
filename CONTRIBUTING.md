# Contributing

## Development workflow

1. Create a branch from `main`.
2. Install JavaScript dependencies with `npm install`.
3. Install repository policy test dependencies with
   `python -m pip install -r requirements-dev.txt`.
4. Run `npm run quality:verify` and
   `python -m pytest tests/test_repository.py`.
5. Keep pull requests small and focused so review remains accurate and humane.

## Pull request requirements

- All GitHub Actions checks must pass.
- New behavior must include tests.
- Source comments and documentation must stay beginner-friendly.
- Security-sensitive changes should explain threat model,
  mitigation, and rollback considerations.
- Visual changes should include screenshots or short recordings when possible.

## Documentation expectations

- Public functions, types, and components should use TSDoc
  comments with examples when helpful.
- Tutorials in `documentation-site/` should be updated when
  user-visible behavior changes.
- The DokuWiki content in `wiki/` should be updated when
  architectural concepts change.

## Code style expectations

- Use self-descriptive variable names. Avoid abbreviations
  unless the term is already industry-standard and clearer
  in abbreviated form.
- Prefer explicit logic over clever one-liners.
- Write comments that explain intent and mental models, not only syntax.
- Keep accessibility, performance, and deterministic behavior
  in mind during implementation.
