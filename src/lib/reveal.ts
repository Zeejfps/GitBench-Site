import type { Action } from 'svelte/action'

/**
 * Scroll-reveal: fades + slides an element into view the first time it enters
 * the viewport. The initial hidden state lives in the global `.reveal` class,
 * gated on `html.reveal-ready` (set by the inline script in app.html before
 * first paint), so this action only has to watch for the element scrolling in.
 *
 * Because the hidden state is gated on `reveal-ready` — which the inline script
 * only adds when motion is allowed — this is automatically a no-op for users
 * who prefer reduced motion, and for no-JS visitors everything stays visible.
 *
 * Pass `{ i }` to stagger an element within a group (used for the card grids).
 */
export const reveal: Action<HTMLElement, { i?: number } | undefined> = (node, params) => {
  if (!document.documentElement.classList.contains('reveal-ready')) return

  if (params?.i) node.style.setProperty('--reveal-i', String(params.i))

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        node.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  )

  observer.observe(node)
  return { destroy: () => observer.disconnect() }
}
