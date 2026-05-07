export function useScrollTo() {
  function scrollTo(id: string) {
    if (!process.client) return
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return { scrollTo }
}
