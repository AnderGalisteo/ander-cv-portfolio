# Architecture

This repository is the source of truth for Ander Galisteo's CV and portfolio website.

## Goals

- Keep the public site generated from Markdown content.
- Allow content updates by editing Markdown files only.
- Keep architecture notes, TODOs, and decision records in the repository without routing them into the website.
- Publish a static site automatically through GitHub Actions.

## Runtime

- Astro renders the static website.
- Markdown content lives under `src/content/en` and `src/content/es`.
- The root URL redirects to English; `/en/`, `/es/`, and `/eu/` are fully separate language views.
- `docs/` is repository documentation only and is not imported by the website.

## Deployment

The `Deploy website` workflow validates content, builds Astro, uploads `dist`, and deploys with GitHub Pages as the account user site at `https://andergalisteo.github.io/`.

Custom-domain DNS is prepared for `andergalisteo.com`, and the site publishes `public/CNAME` with `www.andergalisteo.com` as the GitHub Pages custom domain.
GitHub Pages keeps the GitHub-hosted URL available as an entry point, but redirects it to the configured custom domain.
If the custom domain needs to be disabled temporarily, remove `public/CNAME` and clear the Pages custom domain in GitHub.

Required DNS records:

- `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- `CNAME` record for `www`: `andergalisteo.github.io`

## Updating Content

Edit Markdown files under the matching locale folder:

- `src/content/en`
- `src/content/es`
- `src/content/eu`

Each file must include valid frontmatter. Run `npm run validate` before committing content changes.
