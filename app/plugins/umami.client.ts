export default defineNuxtPlugin(() => {
  // Use try-catch or check if useUmami is available to avoid errors if module not loaded
  let umami: any
  try {
    umami = useUmami()
  } catch (e) {
    console.warn('Umami not initialized:', e)
    return
  }

  if (process.client) {
    // 1. Global click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const element = target.closest('button, a, [role="button"]')
      if (element) {
        // Skip tracking for elements that already have data-umami-event
        // as the module might track them automatically
        if (element.hasAttribute('data-umami-event')) return

        const text = element.innerText.trim().slice(0, 50)
        const aria = element.getAttribute('aria-label') || element.getAttribute('title')
        const label = text || aria || 'unnamed-element'
        
        const id = element.id
        const href = (element as HTMLAnchorElement).href
        
        umami.track('click', {
          label,
          id: id || undefined,
          href: href || undefined,
          path: window.location.pathname,
          tag: element.tagName.toLowerCase()
        })
      }
    }, { capture: true, passive: true })

    // 2. Section visibility tracking
    const sectionTimers = new Map<string, number>()
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionName = entry.target.getAttribute('data-umami-section') || entry.target.id
        if (!sectionName) return

        if (entry.isIntersecting) {
          // Section entered viewport
          sectionTimers.set(sectionName, Date.now())
        } else {
          // Section left viewport
          const startTime = sectionTimers.get(sectionName)
          if (startTime) {
            const duration = Math.round((Date.now() - startTime) / 1000)
            if (duration >= 2) { // Only track if spent at least 2 seconds
              umami.track('section-view', {
                section: sectionName,
                duration: duration,
                path: window.location.pathname
              })
            }
            sectionTimers.delete(sectionName)
          }
        }
      })
    }, { 
      threshold: 0.3 // Trigger when 30% of the section is visible
    })

    const observeSections = () => {
      // Find all sections with ID or specific attribute
      document.querySelectorAll('section[id], [data-umami-section]').forEach(section => {
        observer.observe(section)
      })
    }

    // Initial observation
    observeSections()

    // Re-observe on page changes
    const router = useRouter()
    router.afterEach(() => {
      // Use a small delay to ensure the DOM has updated
      setTimeout(observeSections, 1000)
    })
    
    // Also handle visibility change (user leaves tab)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Send all active section timers
        sectionTimers.forEach((startTime, sectionName) => {
          const duration = Math.round((Date.now() - startTime) / 1000)
          if (duration >= 2) {
            umami.track('section-view', {
              section: sectionName,
              duration: duration,
              path: window.location.pathname
            })
          }
        })
        sectionTimers.clear()
      }
    })
  }
})
