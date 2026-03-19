import { defineConfig, devices } from "@playwright/test";

/**
 * The end-to-end test runner starts the local Vite preview server and then loads the
 * application through a real browser. This gives us confidence that the full stack of
 * bundling, rendering, and interaction works together.
 */
export default defineConfig({
  testDir: "./playwright/tests",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

