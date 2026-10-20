// Analytics hook, ready but off. Nothing is sent until an analytics tool
// is added to the page (for example Plausible or Google Tag Manager) and
// the privacy notice covers it. Events are also pushed to window.dataLayer
// so Tag Manager can pick them up.
type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    plausible?: (event: string, options?: { props?: Props }) => void
  }
}

export function track(event: string, props: Props = {}) {
  window.dataLayer?.push({ event, ...props })
  window.plausible?.(event, { props })
  if (import.meta.env.DEV) console.debug('[track]', event, props)
}
