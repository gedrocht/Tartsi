import { defineConfig } from "vitepress";

/**
 * The documentation site is intentionally written like a guided course.
 * New contributors can start at the introduction and move toward architecture and testing
 * without needing to understand the whole application at once.
 */
export default defineConfig({
  base: "./",
  title: "Tartsi Documentation",
  description:
    "Beginner-friendly tutorials, architecture guides, and library references for the Tartsi magic circle generator.",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Tutorials", link: "/tutorials/first-magic-circle" },
      { text: "Reference", link: "/reference/external-libraries" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "How the generator works", link: "/guide/how-the-generator-works" },
          { text: "Logging and observability", link: "/guide/logging-and-observability" },
          { text: "Testing and quality", link: "/guide/testing-and-quality" }
        ]
      },
      {
        text: "Tutorials",
        items: [{ text: "Build your first magic circle", link: "/tutorials/first-magic-circle" }]
      },
      {
        text: "Reference",
        items: [{ text: "External libraries", link: "/reference/external-libraries" }]
      }
    ]
  }
});

