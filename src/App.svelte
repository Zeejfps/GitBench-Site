<script lang="ts">
  type Feature = {
    title: string
    body: string
  }

  const features: Feature[] = [
    {
      title: 'Visual commit graph',
      body: 'Trace branches, merges, and history at a glance with a fast, readable graph renderer.',
    },
    {
      title: 'Live repo watching',
      body: 'GitBench keeps up with changes on disk and refreshes the moment your working tree moves.',
    },
    {
      title: 'Built for speed',
      body: 'A native desktop client that stays responsive on repositories large and small.',
    },
  ]

  const year = new Date().getFullYear()
</script>

<main>
  <header class="hero">
    <nav>
      <span class="brand">
        <span class="brand-mark">⎇</span> GitBench
      </span>
      <a class="nav-link" href="https://github.com/Zeejfps/GitBench">GitHub</a>
    </nav>

    <div class="hero-inner">
      <h1>A fast, visual Git client.</h1>
      <p class="lede">
        Explore history, branches, and commits with a clean desktop app built for
        people who live in their repositories.
      </p>
      <div class="cta-row">
        <a class="btn primary" href="https://github.com/Zeejfps/GitBench/releases">Download</a>
        <a class="btn ghost" href="https://github.com/Zeejfps/GitBench">View source</a>
      </div>
    </div>
  </header>

  <section class="features">
    {#each features as feature}
      <article class="card">
        <h3>{feature.title}</h3>
        <p>{feature.body}</p>
      </article>
    {/each}
  </section>

  <footer>
    <p>© {year} GitBench · built by <a href="https://builtbyzee.com">zee</a></p>
  </footer>
</main>

<style>
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
  }

  .brand {
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  .brand-mark {
    color: var(--accent);
    margin-right: 4px;
  }

  .nav-link {
    color: var(--text-dim);
    font-size: 0.95rem;
  }

  .hero-inner {
    padding: 72px 0 88px;
    text-align: center;
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    line-height: 1.1;
    margin: 0 0 20px;
    background: linear-gradient(120deg, var(--text), var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .lede {
    max-width: 560px;
    margin: 0 auto 36px;
    font-size: 1.15rem;
    color: var(--text-dim);
  }

  .cta-row {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 12px 26px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.98rem;
    border: 1px solid transparent;
    transition: transform 0.08s ease, background 0.15s ease, border-color 0.15s ease;
  }

  .btn:hover {
    text-decoration: none;
    transform: translateY(-1px);
  }

  .btn.primary {
    background: var(--accent);
    color: #1a1205;
  }

  .btn.ghost {
    border-color: var(--border);
    color: var(--text);
  }

  .btn.ghost:hover {
    border-color: var(--text-dim);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    padding: 8px 0 80px;
  }

  .card {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
  }

  .card h3 {
    margin: 0 0 10px;
    font-size: 1.1rem;
  }

  .card p {
    margin: 0;
    color: var(--text-dim);
    font-size: 0.97rem;
  }

  footer {
    border-top: 1px solid var(--border);
    padding: 28px 0 48px;
    text-align: center;
    color: var(--text-dim);
    font-size: 0.9rem;
  }
</style>
