# gitbench-site

Landing page for [GitBench](https://github.com/Zeejfps/GitBench), built with
**SvelteKit** (prerendered to static HTML via `@sveltejs/adapter-static`) and
hosted on GitHub Pages at **https://gitbench.builtbyzee.com**.

The page is fully prerendered at build time, so crawlers get real HTML content.
On load, the client hydrates to detect the visitor's OS (for the primary download
button) and fetch the latest release version from the GitHub API.

## Develop

```bash
npm install
npm run dev        # SvelteKit dev server
npm run check      # svelte-check (type + a11y)
```

## Build

```bash
npm run build      # prerenders the site to build/
npm run preview    # serve the production build locally
```

## Images & Git LFS

Binary image assets (`*.png`, `*.jpg`, etc.) are stored in **Git LFS** — see
`.gitattributes`. The deploy workflow checks out with `lfs: true` so the real
images (not pointer files) end up in the build.

## Deploy

Pushing a **SemVer tag** (e.g. `v1.0.0`) triggers
`.github/workflows/deploy.yml`, which builds the site and publishes `build/` to
GitHub Pages. You can also trigger it manually via **Actions → Deploy to GitHub
Pages → Run workflow**.

```bash
git tag v1.0.0
git push origin v1.0.0
```

The custom domain is configured via `static/CNAME` (copied into `build/` on build)
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
