# Getting Started

This guide introduces the project from the perspective of a newcomer.

## What the application does

The application renders ornate magic circles using:

- React for the user interface
- TypeScript for strict typing
- SVG for crisp resolution-independent graphics
- A wave-function-collapse-inspired solver for symbolic arrangement

## How to run the project

```bash
npm install
python -m pip install -r requirements-dev.txt
npm run dev
```

## How to run the checks

```bash
npm run quality:verify
python -m pytest tests/test_repository.py
```

## Beginner mental model

Think of the system as three layers:

1. The symbolic language defines which visual symbols exist.
2. The solver decides where each symbol can safely appear.
3. The renderer turns the solved structure into SVG artwork.

