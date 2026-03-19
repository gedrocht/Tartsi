# Start Here

This file is for complete beginners.

If you want the shortest possible path, use these commands in this exact order.

## Step 1: Check prerequisites

```bash
npm run doctor
```

You need:

- Node.js 20.19 or newer
- npm 10 or newer
- Python 3.10 or newer
- Docker Desktop only if you want to run the local wiki

## Step 2: Install everything you need

```bash
npm run setup
```

This installs:

- JavaScript dependencies
- Python dependencies used by the repository-policy tests

## Step 3: Run the app

```bash
npm start
```

This starts the local development server.

## Step 4: Build everything

```bash
npm run build:all
```

This builds:

- The production app
- The API documentation
- The VitePress documentation site
- The combined GitHub Pages output

## Step 5: Test everything

```bash
npm run test:all
```

This runs:

- Frontend unit and component tests
- Python repository-policy tests
- End-to-end browser tests

## Step 6: Optional wiki

```bash
npm run docs:wiki:serve
```

Use this only if you want to browse the local DokuWiki layer.

## If something goes wrong

- Read `README.md` for the bigger project overview.
- Read `CONTRIBUTING.md` if you plan to change code.
- Run `npm run doctor` again to confirm your tools are available.

