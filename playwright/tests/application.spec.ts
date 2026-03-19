import { expect, test } from "@playwright/test";

test("the user can see the generator and produce a different seed", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /wave-function-collapse magic circles in react/i })
  ).toBeVisible();

  const seedPhraseField = page.getByLabel("Seed phrase");
  const originalSeedPhrase = await seedPhraseField.inputValue();

  await page.getByRole("button", { name: /surprise me/i }).click();

  await expect(seedPhraseField).not.toHaveValue(originalSeedPhrase);
  await expect(
    page.getByRole("img", { name: /magic circle generated from the seed/i })
  ).toBeVisible();
});
