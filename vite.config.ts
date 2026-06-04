import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Custom domain (gitbench.builtbyzee.com) serves from root, so base stays '/'.
export default defineConfig({
  base: '/',
  plugins: [svelte()],
})
