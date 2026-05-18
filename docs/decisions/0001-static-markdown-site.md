# 0001: Static Markdown Site

## Decision

Use Astro with Markdown content collections and GitHub Pages deployment.

## Context

The site should update from Markdown, remain responsive, and avoid manual deployment work. The repository is public, so sensitive internal information must not be committed.

## Consequences

- The generated site is fast and simple to host.
- Content schemas catch broken Markdown metadata during validation.
- GitHub Pages can deploy from a public repository without a paid GitHub plan.
