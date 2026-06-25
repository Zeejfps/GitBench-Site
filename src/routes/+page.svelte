<script lang="ts">
  import { onMount, type Component } from 'svelte'
  import { reveal } from '$lib/reveal'
  import Download from '@lucide/svelte/icons/download'
  import Sun from '@lucide/svelte/icons/sun'
  import Moon from '@lucide/svelte/icons/moon'
  import FolderGit2 from '@lucide/svelte/icons/folder-git-2'
  import GitBranch from '@lucide/svelte/icons/git-branch'
  import GitMerge from '@lucide/svelte/icons/git-merge'
  import FileDiff from '@lucide/svelte/icons/file-diff'
  import Package from '@lucide/svelte/icons/package'
  import RefreshCw from '@lucide/svelte/icons/refresh-cw'
  import LayoutGrid from '@lucide/svelte/icons/layout-grid'
  import Tag from '@lucide/svelte/icons/tag'
  import Bug from '@lucide/svelte/icons/bug'
  import Coffee from '@lucide/svelte/icons/coffee'
  import ChevronDown from '@lucide/svelte/icons/chevron-down'

  const REPO = 'Zeejfps/GitBench'
  const LATEST = `https://github.com/${REPO}/releases/latest`
  const COFFEE = 'https://buymeacoffee.com/zeejfps'
  const dl = (asset: string) =>
    `https://github.com/${REPO}/releases/latest/download/${asset}`

  // Stable, unversioned asset names produced by the Velopack release workflow.
  const assets = {
    winSetup: dl('GitBench-win-x64-Setup.exe'),
    winPortable: dl('GitBench-win-x64-Portable.zip'),
    macPkg: dl('GitBench-osx-arm64-Setup.pkg'),
    macPortable: dl('GitBench-osx-arm64-Portable.zip'),
    macPkgIntel: dl('GitBench-osx-x64-Setup.pkg'),
    macPortableIntel: dl('GitBench-osx-x64-Portable.zip'),
    linuxAppImage: dl('GitBench-linux-x64.AppImage'),
  }

  type OS = 'windows' | 'mac' | 'linux' | 'unknown'

  function detectOS(): OS {
    if (typeof navigator === 'undefined') return 'unknown'
    const ua = navigator.userAgent
    if (/Windows|Win64|Win32/i.test(ua)) return 'windows'
    if (/Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) return 'mac'
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux'
    return 'unknown'
  }

  const primary: Record<OS, { label: string; href: string }> = {
    windows: { label: 'Download for Windows', href: assets.winSetup },
    mac: { label: 'Download for macOS', href: assets.macPkg },
    linux: { label: 'Download for Linux', href: assets.linuxAppImage },
    unknown: { label: 'Download', href: '#download' },
  }

  type Feature = { title: string; body: string; icon: Component }
  const features: Feature[] = [
    {
      title: 'Switch & organize repos',
      body: 'Group every repository into collapsible folders in the sidebar and jump between them instantly. Your whole workspace in one window.',
      icon: FolderGit2,
    },
    {
      title: 'Visual commit graph',
      body: 'Trace branches, merges, and history at a glance with a fast, readable graph renderer.',
      icon: GitBranch,
    },
    {
      title: 'Branch management',
      body: 'Checkout, rename, delete, merge, rebase, and fast-forward, local and remote, straight from the context menu.',
      icon: GitMerge,
    },
    {
      title: 'Staging & inline diffs',
      body: 'Stage and unstage by file or folder, discard, stash, and review every change in an inline diff view.',
      icon: FileDiff,
    },
    {
      title: 'Worktrees, stashes & submodules',
      body: 'Browse stashes and manage worktrees and submodules, the bits a real repository actually has.',
      icon: Package,
    },
    {
      title: 'Auto-updates',
      body: 'GitBench checks for new releases on launch and applies them with one click, no manual reinstalls.',
      icon: RefreshCw,
    },
  ]

  // Plain-text Q/A reused for both the rendered section and the FAQPage JSON-LD,
  // so the structured data always matches the visible copy (Google requires this).
  type Faq = { q: string; a: string }
  const faqs: Faq[] = [
    {
      q: 'Is GitBench free?',
      a: 'Yes. GitBench is completely free and open source. There are no paid tiers, accounts, or license keys — every feature is available to everyone.',
    },
    {
      q: 'Which operating systems does GitBench support?',
      a: 'GitBench runs natively on Windows (x64), macOS (both Apple Silicon and Intel), and Linux (x64, as an AppImage).',
    },
    {
      q: 'Do I need Git installed to use GitBench?',
      a: 'Yes. GitBench drives your existing Git command-line installation, so you need Git installed and available on your system PATH. You can get it from git-scm.com.',
    },
    {
      q: 'How is GitBench different from GitKraken, Sourcetree, or Fork?',
      a: 'GitBench is built around working in many repositories at once: every repo stays grouped in one sidebar so you can switch instantly without reopening windows. It is a native, GPU-accelerated app that is free and open source, with a visual commit graph, inline diffs, and one-click auto-updates.',
    },
    {
      q: 'Does GitBench update automatically?',
      a: 'Yes. GitBench checks for new releases on launch and applies them with a single click, so you stay current without manually downloading and reinstalling.',
    },
    {
      q: 'Is GitBench safe to use, and where is the source code?',
      a: 'GitBench is open source — all of the code and every release build are published on GitHub, so you can review exactly what it does or build it yourself.',
    },
  ]

  let os: OS = $state('unknown')
  let version = $state('')
  let shotTheme: 'dark' | 'light' = $state('dark')

  onMount(() => {
    os = detectOS()
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (data?.tag_name) version = data.tag_name
      })
      .catch(() => {
        /* rate-limited or offline: just don't show a version */
      })
  })

  const primaryCta = $derived(primary[os])

  // Evaluated at prerender time; the displayed copyright year tracks the build.
  const year = new Date().getFullYear()

  const title = 'GitBench: a fast Git client for Windows, macOS & Linux'
  const description =
    'A fast, native desktop Git client for juggling many repositories: organize and switch between repos, a visual commit graph, inline diffs, and auto-updates. Free and open source.'
  const ogDescription =
    'A native desktop Git client for juggling many repositories: a visual commit graph, inline diffs, and one-click auto-updates. Free for Windows, macOS, and Linux.'
  const siteUrl = 'https://gitbench.builtbyzee.com/'
  const ogImage = 'https://gitbench.builtbyzee.com/screenshot_dark.jpg'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GitBench',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    url: siteUrl,
    downloadUrl: LATEST,
    image: ogImage,
    description:
      'A fast, native desktop Git client for juggling many repositories, with a visual commit graph, inline diffs, and one-click auto-updates.',
    author: { '@type': 'Person', name: 'Zee Vasilyev', url: 'https://evasilyev.com' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={siteUrl} />

  <meta property="og:site_name" content="GitBench" />
  <meta property="og:title" content="GitBench: a fast, cross-platform Git client" />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="2267" />
  <meta property="og:image:height" content="1245" />
  <meta
    property="og:image:alt"
    content="The GitBench desktop app showing commit history, the commit graph, and an inline diff."
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="GitBench: a fast, cross-platform Git client" />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content={ogImage} />

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqJsonLd)}<\/script>`}
</svelte:head>

{#snippet ghMark(size: number)}
  <svg class="gh-mark" viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
{/snippet}

<div class="page">
  <nav>
    <a class="brand" href="/">
      <img class="brand-mark" src="/icon.png" alt="" width="32" height="32" />
      <span>GitBench</span>
    </a>
    <div class="nav-links">
      <a href="#features"><LayoutGrid size={16} aria-hidden="true" /> Features</a>
      <a href="#download"><Download size={16} aria-hidden="true" /> Download</a>
      <a href="https://github.com/{REPO}">{@render ghMark(16)} GitHub</a>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow reveal" use:reveal>
        Free · <a href="https://github.com/{REPO}">open source</a> · Windows, macOS &amp; Linux
      </p>
      <h1 class="reveal" use:reveal={{ i: 1 }}>All your repositories,<br />organized and a click away.</h1>
      <p class="lede reveal" use:reveal={{ i: 2 }}>
        GitBench keeps every repo you work in grouped in one sidebar, so you can
        switch between them instantly, with no reopening windows or re-adding folders.
        It's a native, GPU-accelerated client with a visual commit graph, inline
        diffs, and one-click auto-updates.
      </p>

      <div class="cta reveal" use:reveal={{ i: 3 }}>
        <a
          class="btn primary"
          href={primaryCta.href}
          rel={primaryCta.href.startsWith('#') ? null : 'noopener'}
        >
          <Download size={18} aria-hidden="true" />
          {primaryCta.label}
        </a>
        <p class="cta-meta">
          {#if version}
            Latest: {version} · free
          {:else}
            Latest release · free
          {/if}
          {#if os === 'mac'} · Apple Silicon &amp; Intel{/if}
          · <a href="#download">other platforms</a>
        </p>
      </div>
    </div>
  </header>

  <section id="preview" class="preview">
    <h2 class="section-title reveal" use:reveal>See it in action</h2>
    <p class="preview-sub reveal" use:reveal={{ i: 1 }}>
      GitBench comes with a dark and a light theme — see how both look.
    </p>

    <figure class="shot reveal" use:reveal={{ i: 2 }}>
      <div class="shot-toggle" role="group" aria-label="Screenshot theme">
        <button
          class="toggle-btn"
          class:active={shotTheme === 'dark'}
          aria-pressed={shotTheme === 'dark'}
          onclick={() => (shotTheme = 'dark')}><Moon size={15} aria-hidden="true" /> Dark</button>
        <button
          class="toggle-btn"
          class:active={shotTheme === 'light'}
          aria-pressed={shotTheme === 'light'}
          onclick={() => (shotTheme = 'light')}><Sun size={15} aria-hidden="true" /> Light</button>
      </div>
      <div class="shot-frame">
        <img
          src={shotTheme === 'dark' ? '/screenshot_dark.jpg' : '/screenshot_light.jpg'}
          alt="GitBench showing the commit history, graph, and an inline diff view in {shotTheme} mode"
          loading="eager"
        />
      </div>
    </figure>
  </section>

  <section id="features" class="features">
    <h2 class="section-title reveal" use:reveal>Everything a real repo needs</h2>
    <div class="feature-grid">
      {#each features as feature, i}
        {@const Icon = feature.icon}
        <article class="card reveal" use:reveal={{ i }}>
          <span class="card-icon"><Icon size={22} aria-hidden="true" /></span>
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </article>
      {/each}
    </div>
  </section>

  <section id="download" class="download">
    <h2 class="section-title reveal" use:reveal>Download GitBench{version ? ` ${version}` : ''}</h2>
    <p class="download-sub reveal" use:reveal>Pick your platform. Installs include automatic updates.</p>

    <div class="platforms">
      <article class="platform reveal" use:reveal={{ i: 0 }} class:recommended={os === 'windows'}>
        <h3>Windows</h3>
        <a class="btn primary block" href={assets.winSetup} rel="noopener"><Download size={17} aria-hidden="true" /> Download installer</a>
        <p class="platform-meta">
          <code>Setup.exe</code> · x64 · or
          <a href={assets.winPortable} rel="noopener">portable .zip</a>
        </p>
      </article>

      <article class="platform reveal" use:reveal={{ i: 1 }} class:recommended={os === 'mac'}>
        <h3>macOS</h3>
        <a class="btn primary block" href={assets.macPkg} rel="noopener"><Download size={17} aria-hidden="true" /> Apple Silicon .pkg</a>
        <a class="btn secondary block" href={assets.macPkgIntel} rel="noopener"><Download size={17} aria-hidden="true" /> Intel .pkg</a>
        <p class="platform-meta">
          Apple Silicon or Intel · portable .zip for
          <a href={assets.macPortable} rel="noopener">Apple Silicon</a> ·
          <a href={assets.macPortableIntel} rel="noopener">Intel</a>
        </p>
      </article>

      <article class="platform reveal" use:reveal={{ i: 2 }} class:recommended={os === 'linux'}>
        <h3>Linux</h3>
        <a class="btn primary block" href={assets.linuxAppImage} rel="noopener"><Download size={17} aria-hidden="true" /> Download AppImage</a>
        <p class="platform-meta"><code>.AppImage</code> · x64</p>
      </article>
    </div>

    <p class="requires reveal" use:reveal>
      GitBench drives the <code>git</code> command line, so make sure
      <a href="https://git-scm.com/downloads">Git</a> is installed and on your
      <code>PATH</code>. All builds and source are on
      <a href={LATEST}>GitHub Releases</a>.
    </p>
  </section>

  <section id="faq" class="faq">
    <h2 class="section-title reveal" use:reveal>Frequently asked questions</h2>
    <div class="faq-list">
      {#each faqs as faq, i}
        <details class="faq-item reveal" use:reveal={{ i }}>
          <summary>
            {faq.q}
            <ChevronDown class="chev" size={20} aria-hidden="true" />
          </summary>
          <p>{faq.a}</p>
        </details>
      {/each}
    </div>
  </section>

  <section class="support">
    <span class="support-icon reveal" use:reveal><Coffee size={26} aria-hidden="true" /></span>
    <h2 class="section-title reveal" use:reveal={{ i: 1 }}>Enjoying GitBench?</h2>
    <p class="support-sub reveal" use:reveal={{ i: 2 }}>
      GitBench is free and open source. If it saves you time, you can help fuel
      its development with a coffee.
    </p>
    <a class="btn primary reveal" use:reveal={{ i: 3 }} href={COFFEE} rel="noopener">
      <Coffee size={18} aria-hidden="true" /> Buy me a coffee
    </a>
  </section>

  <footer>
    <div class="footer-links">
      <a href="https://github.com/{REPO}">{@render ghMark(15)} GitHub</a>
      <a href="https://github.com/{REPO}/releases"><Tag size={15} aria-hidden="true" /> Releases</a>
      <a href="https://github.com/{REPO}/issues"><Bug size={15} aria-hidden="true" /> Report an issue</a>
      <a href={COFFEE} rel="noopener"><Coffee size={15} aria-hidden="true" /> Buy me a coffee</a>
    </div>
    <p>© {year} GitBench · built by <a href="https://evasilyev.com">zee</a></p>
  </footer>
</div>

<style>
  .page {
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ---------- nav ---------- */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.12rem;
    letter-spacing: 0.01em;
    color: var(--text);
  }
  .brand:hover {
    text-decoration: none;
  }
  .brand-mark {
    border-radius: 8px;
    display: block;
  }

  .nav-links {
    display: flex;
    gap: 26px;
    font-size: 0.95rem;
  }
  .nav-links a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--text-dim);
  }
  .nav-links a:hover {
    color: var(--text);
    text-decoration: none;
  }
  .gh-mark {
    display: block;
  }

  /* ---------- hero ---------- */
  .hero {
    text-align: center;
    padding: 64px 0 32px;
  }
  .hero-inner {
    max-width: 760px;
    margin: 0 auto;
  }

  .eyebrow {
    display: inline-block;
    margin: 0 0 22px;
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 0.82rem;
    color: var(--text-dim);
    background: var(--bg-elev);
  }
  .eyebrow a {
    color: var(--text-dim);
    text-decoration: underline;
    text-decoration-color: var(--border);
    text-underline-offset: 2px;
  }
  .eyebrow a:hover {
    color: var(--accent);
    text-decoration-color: var(--accent);
  }

  h1 {
    font-size: clamp(2.3rem, 5.2vw, 3.5rem);
    line-height: 1.16;
    letter-spacing: -0.02em;
    margin: 0 0 22px;
    /* Pad so background-clip: text doesn't shave glyph edges/descenders (e.g. the "g"). */
    padding: 0.04em 0.08em 0.12em;
    background: linear-gradient(120deg, var(--text) 40%, var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .lede {
    max-width: 600px;
    margin: 0 auto 34px;
    font-size: 1.14rem;
    color: var(--text-dim);
  }

  .cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  .cta-meta {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-dim);
  }
  .cta-meta a {
    color: var(--text-dim);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .cta-meta a:hover {
    color: var(--text);
  }

  /* ---------- buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 28px;
    border-radius: 9px;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid transparent;
    transition:
      transform 0.08s ease,
      box-shadow 0.15s ease,
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .btn:hover {
    text-decoration: none;
    transform: translateY(-1px);
  }
  .btn.primary {
    background: var(--accent);
    color: #1a1205;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.15) inset;
  }
  .btn.primary:hover {
    background: #f7984f;
    box-shadow: 0 8px 24px -8px var(--accent);
  }
  .btn.secondary {
    background: var(--bg-elev);
    color: var(--text);
    border-color: var(--border);
  }
  .btn.secondary:hover {
    border-color: var(--accent);
  }
  .btn.block {
    display: flex;
    width: 100%;
  }
  .btn.block + .btn.block {
    margin-top: 10px;
  }
  .btn :global(svg) {
    flex: none;
  }

  /* ---------- preview / screenshot ---------- */
  .preview {
    padding: 96px 0 16px;
    text-align: center;
  }
  .preview-sub {
    color: var(--text-dim);
    margin: 0 0 30px;
  }
  .shot {
    margin: 0;
  }
  .shot-toggle {
    display: inline-flex;
    gap: 2px;
    margin: 0 0 16px;
    padding: 3px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg-elev);
  }
  .toggle-btn {
    appearance: none;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 16px;
    border-radius: 999px;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-dim);
    background: transparent;
    transition: color 0.12s ease, background 0.12s ease;
  }
  .toggle-btn:hover {
    color: var(--text);
  }
  .toggle-btn.active {
    background: var(--accent);
    color: #1a1205;
  }
  .shot-frame {
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: var(--bg-elev);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04) inset,
      0 40px 90px -40px rgba(0, 0, 0, 0.8);
  }
  .shot-frame img {
    display: block;
    width: 100%;
    height: auto;
  }

  /* ---------- sections ---------- */
  .section-title {
    text-align: center;
    font-size: clamp(1.5rem, 3vw, 2rem);
    letter-spacing: -0.01em;
    margin: 0 0 10px;
  }

  .features {
    padding: 96px 0 16px;
  }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
    margin-top: 36px;
  }
  .card {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.15s ease, transform 0.1s ease;
  }
  .card:hover {
    border-color: #41484f;
    transform: translateY(-2px);
  }
  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-bottom: 16px;
    border-radius: 11px;
    color: var(--accent);
    background: rgba(240, 136, 62, 0.12);
  }
  .card h3 {
    margin: 0 0 10px;
    font-size: 1.08rem;
  }
  .card p {
    margin: 0;
    color: var(--text-dim);
    font-size: 0.96rem;
  }

  /* ---------- download ---------- */
  .download {
    padding: 96px 0 16px;
  }
  .download-sub {
    text-align: center;
    color: var(--text-dim);
    margin: 0 0 40px;
  }
  .platforms {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }
  .platform {
    position: relative;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px 24px;
    text-align: center;
  }
  .platform.recommended {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }
  .platform.recommended::after {
    content: 'Your platform';
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent);
    color: #1a1205;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .platform h3 {
    margin: 0 0 18px;
    font-size: 1.2rem;
  }
  .platform-meta {
    margin: 14px 0 0;
    font-size: 0.86rem;
    color: var(--text-dim);
  }
  .platform-meta a {
    color: var(--text-dim);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .platform-meta a:hover {
    color: var(--text);
  }

  code {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 5px;
    padding: 1px 6px;
    font-size: 0.85em;
  }

  .requires {
    max-width: 620px;
    margin: 40px auto 0;
    text-align: center;
    font-size: 0.92rem;
    color: var(--text-dim);
  }

  /* ---------- faq ---------- */
  .faq {
    padding: 96px 0 16px;
  }
  .faq-list {
    max-width: 760px;
    margin: 36px auto 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .faq-item {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0 22px;
    transition: border-color 0.15s ease;
  }
  .faq-item:hover {
    border-color: #41484f;
  }
  .faq-item summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    list-style: none;
    padding: 20px 0;
    font-weight: 600;
    font-size: 1.02rem;
  }
  .faq-item summary::-webkit-details-marker {
    display: none;
  }
  .faq-item summary :global(.chev) {
    flex: none;
    color: var(--text-dim);
    transition: transform 0.18s ease;
  }
  .faq-item[open] summary :global(.chev) {
    transform: rotate(180deg);
  }
  .faq-item p {
    margin: 0;
    padding: 0 0 22px;
    color: var(--text-dim);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  /* ---------- support ---------- */
  .support {
    padding: 96px 0 16px;
    text-align: center;
  }
  .support-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: 18px;
    border-radius: 14px;
    color: var(--accent);
    background: rgba(240, 136, 62, 0.12);
  }
  .support-sub {
    max-width: 520px;
    margin: 0 auto 28px;
    color: var(--text-dim);
  }

  /* ---------- footer ---------- */
  footer {
    border-top: 1px solid var(--border);
    margin-top: 96px;
    padding: 30px 0 56px;
    text-align: center;
    color: var(--text-dim);
    font-size: 0.9rem;
  }
  .footer-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 16px;
  }
  .footer-links a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--text-dim);
  }
  .footer-links a:hover {
    color: var(--text);
    text-decoration: none;
  }

  @media (max-width: 560px) {
    .nav-links a:first-child {
      display: none;
    }
    .hero {
      padding-top: 40px;
    }
    .preview,
    .features,
    .download {
      padding-top: 72px;
    }
  }
</style>
