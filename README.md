# embedded-alerts.github.io

Astro marketing site for **Embedded Alerts**.

- Built with Astro, not Jekyll.
- The canonical document is `src/pages/index.astro`; only the tested `dist/` artifact is published.
- Uses GitHub Pages Actions deployment.
- Includes a responsive landing page, SEO metadata, favicon, proof points, workflow, integrations, architecture, and launch CTA.
- `public/.nojekyll` is present only to bypass Jekyll processing on Pages; there is no Jekyll site or `_config.yml`.
- Repository contract metadata lives in `project.json`, `docs/architecture.md`, and `AGENTS.md`.

## Commands

```bash
npm ci --ignore-scripts
npm test
npm run build
python3 scripts/verify_repo.py
```

## Repository family

The site links the public product narrative to `eal-clients`, `eal-libs`, `eal-monorepo`, and `eal-infra`. GitHub Pages deployment is handled by Actions; Jekyll is not used.
