import { expect, test } from "@playwright/test";

test("renders English and Spanish without mixing primary labels", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: "Ander Galisteo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Español" })).toBeVisible();
  await expect(page.locator("#experience").getByText("Experience", { exact: true })).toBeVisible();
  await expect(page.getByText("Experiencia", { exact: true })).toHaveCount(0);

  await page.goto("/es/");
  await expect(page.getByRole("heading", { name: "Ander Galisteo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toBeVisible();
  await expect(page.locator("#experience").getByText("Experiencia", { exact: true })).toBeVisible();
});

test("has no public phone number and exposes downloadable CV", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByText("+34")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", /Ander-Galisteo-CV\.pdf$/);
});
