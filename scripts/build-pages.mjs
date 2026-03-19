import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

/**
 * GitHub Pages can only publish one static directory at a time.
 * This script merges the built application, VitePress site, and generated TypeDoc output
 * into a single deployment folder so the app and documentation can live side by side.
 */
const repositoryRootDirectoryPath = process.cwd();
const applicationBuildDirectoryPath = resolve(repositoryRootDirectoryPath, "dist");
const documentationSiteBuildDirectoryPath = resolve(
  repositoryRootDirectoryPath,
  "documentation-site/.vitepress/dist"
);
const typeDocOutputDirectoryPath = resolve(repositoryRootDirectoryPath, "typedoc-output");
const pagesOutputDirectoryPath = resolve(repositoryRootDirectoryPath, "dist-pages");

if (existsSync(pagesOutputDirectoryPath)) {
  rmSync(pagesOutputDirectoryPath, { recursive: true, force: true });
}

mkdirSync(pagesOutputDirectoryPath, { recursive: true });

if (existsSync(applicationBuildDirectoryPath)) {
  cpSync(applicationBuildDirectoryPath, pagesOutputDirectoryPath, { recursive: true });
}

if (existsSync(documentationSiteBuildDirectoryPath)) {
  cpSync(documentationSiteBuildDirectoryPath, resolve(pagesOutputDirectoryPath, "wiki"), {
    recursive: true
  });
}

if (existsSync(typeDocOutputDirectoryPath)) {
  cpSync(typeDocOutputDirectoryPath, resolve(pagesOutputDirectoryPath, "api"), {
    recursive: true
  });
}

