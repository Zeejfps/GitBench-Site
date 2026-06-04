# gitbench-site

Landing page for [GitBench](https://github.com/Zeejfps/GitBench), built with Svelte + Vite and hosted on GitHub Pages at **https://gitbench.builtbyzee.com**.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages.

The custom domain is configured via `public/CNAME` (copied into `dist/` on build)
and the repo's **Settings → Pages** custom-domain field.

### One-time GitHub setup

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Pages → Custom domain:** `gitbench.builtbyzee.com`, then enable
   *Enforce HTTPS* once the certificate is issued.
4. DNS at your domain provider — add a `CNAME` record:

   | Type  | Name     | Value                  |
   |-------|----------|------------------------|
   | CNAME | gitbench | Zeejfps.github.io.  |
