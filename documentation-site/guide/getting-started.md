# Getting Started

This guide introduces the project from the perspective of a newcomer.

## The shortest path

If you do not want to think about which command to run next, use this sequence:

```bash
npm run doctor
npm run setup
npm start
```

When you want to build and test everything:

```bash
npm run build:all
npm run test:all
```

## What the application does

The application renders ornate magic circles using:

- React for the user interface
- TypeScript for strict typing
- SVG for crisp resolution-independent graphics
- A wave-function-collapse-inspired solver for symbolic arrangement

## How to run the project

```bash
npm run setup
npm start
```

## How to run the checks

```bash
npm run quality:verify
```

For the one-command beginner version:

```bash
npm run test:all
```

## Beginner mental model

Think of the system as three layers:

1. The symbolic language defines which visual symbols exist.
2. The solver decides where each symbol can safely appear.
3. The renderer turns the solved structure into SVG artwork.
