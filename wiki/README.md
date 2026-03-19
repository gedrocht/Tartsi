# DokuWiki Layer

This folder stores the repository's separate wiki layer.

## Why a wiki exists in addition to the docs site

The VitePress site is optimized for polished tutorial flow and GitHub Pages deployment.
The DokuWiki layer is optimized for step-by-step reading, cross-linking, and browsing like a traditional software knowledge base.

## How to run the wiki locally

```bash
docker compose -f wiki/docker-compose.yml up
```

Then open the local address reported by Docker.

