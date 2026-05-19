import { expect, test } from "@playwright/test";

test("renders English, Spanish, and Basque without mixing primary labels", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: "Ander Galisteo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Español" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Euskara" })).toBeVisible();
  await expect(page.getByLabel("Primary navigation").getByRole("link", { name: "Experience" })).toBeVisible();
  await expect(page.getByText("Experiencia", { exact: true })).toHaveCount(0);

  await page.goto("/es/");
  await expect(page.getByRole("heading", { name: "Ander Galisteo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toBeVisible();
  await expect(page.getByLabel("Primary navigation").getByRole("link", { name: "Experiencia" })).toBeVisible();

  await page.goto("/eu/");
  await expect(page.getByRole("heading", { name: "Ander Galisteo" })).toBeVisible();
  await expect(page.getByLabel("Primary navigation").getByRole("link", { name: "Esperientzia" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Español" })).toBeVisible();
});

test("uses separate pages for major sections and preserves language context", async ({ page }) => {
  await page.goto("/en/");
  await page.getByLabel("Primary navigation").getByRole("link", { name: "Experience" }).click();
  await expect(page).toHaveURL(/\/en\/experience\/$/);
  await expect(page.getByRole("heading", { name: "Experience" }).first()).toBeVisible();
  await expect(page.getByText("Director of Industrial Cybersecurity")).toBeVisible();

  await page.getByRole("link", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/experience\/$/);
  await expect(page.getByRole("heading", { name: "Experiencia" }).first()).toBeVisible();

  await page.goto("/en/research/");
  await expect(page.getByRole("heading", { name: "Publications" }).first()).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "2020 PhD" }).getByRole("heading", { name: "Visible Light Communication Networks for IoT and its Applications" })).toBeVisible();
});

test("surfaces current quantum security and PQC work", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByText("Quantum security and PQC").first()).toBeVisible();
  await expect(page.getByText("where, how, and when to adopt post-quantum cryptography")).toBeVisible();

  await page.goto("/en/work/");
  await expect(page.getByRole("heading", { name: "Post-quantum cryptography transition framework" })).toBeVisible();
  await expect(page.getByText("where post-quantum cryptography should be added")).toBeVisible();
});

test("has no public phone number and exposes downloadable CV", async ({ page }) => {
  await page.goto("/en/contact/");
  await expect(page.getByText("+34")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", /Ander-Galisteo-CV\.pdf$/);
});
