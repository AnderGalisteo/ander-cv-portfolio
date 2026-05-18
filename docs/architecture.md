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

## Updating Content

Edit Markdown files under the matching locale folder:

- `src/content/en`
- `src/content/es`
- `src/content/eu`

Each file must include valid frontmatter. Run `npm run validate` before committing content changes.
