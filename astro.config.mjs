import { defineConfig } from "astro/config";

const base = process.env.BASE_PATH || "/";
const site = process.env.SITE_URL || "https://andergalisteo.github.io";

export default defineConfig({
  site,
  base,
  trailingSlash: "always"
});
