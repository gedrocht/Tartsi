# Tartsi: Magic Circle Generator

[![CI](https://github.com/gedrocht/Tartsi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/gedrocht/Tartsi/actions/workflows/ci.yml)
[![Repo Health](https://github.com/gedrocht/Tartsi/actions/workflows/repo-health.yml/badge.svg?branch=main)](https://github.com/gedrocht/Tartsi/actions/workflows/repo-health.yml)
[![CodeQL](https://github.com/gedrocht/Tartsi/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/gedrocht/Tartsi/actions/workflows/codeql.yml)
[![Pages](https://github.com/gedrocht/Tartsi/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/gedrocht/Tartsi/actions/workflows/pages.yml)

If you are brand new, start with [START_HERE.md](./START_HERE.md).

Tartsi is a React and TypeScript web application that
generates dramatic magic circles made from a geometric
symbolic language. The visual language uses a
wave-function-collapse-inspired constraint solver to
arrange symbols into multiple concentric rings,
creating ceremonial diagrams with an alchemical and
cosmic aesthetic.

## At a glance

- Live application and docs:
  [GitHub Pages](https://gedrocht.github.io/Tartsi/)
- Beginner onboarding:
  [START_HERE.md](./START_HERE.md)
- Contributor workflow:
  [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security process:
  [SECURITY.md](./SECURITY.md)

The repository is intentionally strict. It includes:

- A typed React application with beginner-focused source comments.
- Unit, component, accessibility, end-to-end, and repository-policy tests.
- API documentation generated from TSDoc comments via TypeDoc.
- A separate serveable documentation site for tutorials and beginner guides.
- A separate DokuWiki layer for wiki-style onboarding and deeper walkthroughs.
- GitHub Actions for linting, type checking, testing,
  coverage, security scans, dependency review, CodeQL,
  link checking, documentation builds, and GitHub Pages
  deployment.

## Why this project exists

Tartsi is meant to be both a visual toy and a learning
project. It combines procedural generation, symbolic
design, SVG rendering, strict quality gates, and
beginner-friendly documentation in one place so a new
developer can explore a real frontend codebase without
having to guess how it is supposed to be built,
tested, documented, and reviewed.

## Features

- Deterministic generation from human-readable seed phrases
- Multiple concentric rings with symmetry-aware symbol placement
- A geometric symbolic language composed of triangles,
  squares, diamonds, waves, spirals, petals, chevrons,
  and orbital patterns
- SVG rendering for crisp export quality
- In-app logging plus browser-console logging
- Export of generated circles as SVG

## What GitHub shows visitors

- Automated CI, linting, testing, docs, and deployment
  badges at the top of this README
- A repository description that explains the generator,
  the wave-function-collapse-inspired layout system, and
  the beginner-friendly documentation focus
- A GitHub Pages deployment intended to act as the
  project front door for demos and documentation

## Technology choices

- React + TypeScript for a strict, maintainable UI
- Vite for fast development and static builds
- Vitest + Testing Library + jest-axe for unit,
  component, and accessibility testing
- Playwright for end-to-end browser validation
- TypeDoc for API documentation
- VitePress for the GitHub Pages documentation site
- DokuWiki for the separate beginner-friendly wiki layer

## Fastest beginner path

Run these commands in order:

```bash
npm run doctor
npm run setup
npm start
```

When you want to build everything:

```bash
npm run build:all
```

When you want to test everything:

```bash
npm run test:all
```

## Detailed setup

### Prerequisites

- Node.js 20.19 or newer
- npm 10 or newer
- Python 3.10 or newer for repository policy tests
- Docker Desktop if you want to run the DokuWiki layer locally

### Install dependencies

```bash
npm run setup
```

### Run the application locally

```bash
npm start
```

### Build the application

```bash
npm run build
```

### Build every static output

```bash
npm run build:all
```

### Test every major layer

```bash
npm run test:all
```

You can still call the script files directly if you prefer script-folder entry points:

```bash
node ./scripts/build.mjs
```

### Run the main quality checks

```bash
npm run quality:verify
python -m pytest tests/test_repository.py
```

### Serve the DokuWiki layer locally

```bash
docker compose -f wiki/docker-compose.yml up
```

## Project structure

- `src/`: React application source code
- `scripts/`: beginner-friendly setup, build, run, and test entry points
- `documentation-site/`: GitHub Pages documentation site powered by VitePress
- `wiki/`: DokuWiki content and local serving configuration
- `tests/`: repository policy checks that protect project standards
- `.github/workflows/`: GitHub automation for quality,
  security, and documentation

## Documentation layers

- API reference: generated from source comments using TypeDoc
- Documentation site: beginner tutorials, architecture
  guides, testing guides, and library references
- Wiki: a browsable DokuWiki knowledge base for step-by-step onboarding

## Important scripts

- `npm run dev`: start the application in development mode
- `npm run doctor`: check whether the required tools are installed
- `npm run setup`: install the JavaScript and Python prerequisites
- `npm start`: start the development server
- `npm run build`: type-check and build the application
- `npm run build:application`: build only the Vite application bundle
- `npm run build:docs`: build the API docs and documentation site
- `npm run build:all`: build the app, docs, and Pages package
- `npm run test`: run Vitest with coverage
- `npm run test:e2e`: run Playwright browser tests
- `npm run test:repository`: run the Python repository-policy tests
- `npm run test:all`: run frontend, repository, and end-to-end tests
- `npm run docs:api`: build API docs from TSDoc comments
- `npm run docs:site:build`: build the VitePress documentation site
- `npm run docs:wiki:serve`: start the DokuWiki layer with Docker
- `npm run pages:build`: merge the app and documentation
  outputs for GitHub Pages
- `npm run quality:verify`: run the main local quality gate

## The simplest answers

- Want to know what must be installed first? Run `npm run doctor`.
- Want one command that installs what you need? Run `npm run setup`.
- Want to start the project? Run `npm start`.
- Want to build everything? Run `npm run build:all`.
- Want to test everything? Run `npm run test:all`.

## Script folder entry points

- `scripts/doctor.mjs`: check which required tools are installed
- `scripts/setup.mjs`: install the JavaScript and Python prerequisites
- `scripts/start-development.mjs`: start the development server
- `scripts/build.mjs`: type-check and build the production app
- `scripts/build-all.mjs`: build the app, docs, and Pages output
- `scripts/build-docs.mjs`: build the API docs and VitePress site
- `scripts/build-pages.mjs`: combine the app and docs outputs for GitHub Pages
- `scripts/test-all.mjs`: run the major automated test layers

## Beginner path

1. Read the documentation site starting at
   `documentation-site/guide/getting-started.md`.
2. Read the DokuWiki `start` page and its architecture pages.
3. Open `src/domain/magicCircleLanguage.ts` to understand the symbolic language.
4. Open `src/domain/waveFunctionCollapseEngine.ts` to study the solver.
5. Open `src/components/MagicCircleCanvas.tsx` to see
   how the final SVG is drawn.

## GitHub protections this repository expects

- Required status checks from the workflows in `.github/workflows/`
- Branch protection on the default branch
- At least one approving review
- CODEOWNERS-based review routing
- Secret scanning and dependency review
- GitHub Pages deployment from reviewed code only
