export default defineNuxtPlugin(() => {
  // Use try-catch or check if useUmami is available to avoid errors if module not loaded
  const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }

  if (process.client) {
    // 1. Global click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const element = target.closest('button, a, [role="button"], img')
      if (element) {
        // Skip tracking for elements that already have data-umami-event
        // as the module might track them automatically
        if (element.hasAttribute('data-umami-event')) return

        const text = element.innerText?.trim().slice(0, 50)
        const aria = element.getAttribute('aria-label') || element.getAttribute('title')
        
        let label = text || aria || 'unnamed-element'
        if (element.tagName.toLowerCase() === 'img') {
          label = (element as HTMLImageElement).alt || (element as HTMLImageElement).src || 'image'
        }
        
        const id = element.id
        const href = (element as HTMLAnchorElement).href || (element as HTMLImageElement).src
        
        if (href) {
          if (href.startsWith('tel:')) {
            umami.track('contact-phone-click', {
              phone: href.replace('tel:', ''),
              label,
              path: window.location.pathname
            })
            return
          }
          if (href.startsWith('mailto:')) {
            umami.track('contact-email-click', {
              email: href.replace('mailto:', ''),
              label,
              path: window.location.pathname
            })
            return
          }
          if (href.includes('wa.me') || href.includes('whatsapp.com')) {
            const match = href.match(/(?:wa\.me|api\.whatsapp\.com\/send\?phone=)(\d+)/)
            const phone = match ? '+' + match[1] : href
            umami.track('contact-whatsapp-click', {
              phone,
              label,
              path: window.location.pathname
            })
            return
          }
          if (
            href.includes('google.com/maps') ||
            href.includes('maps.google.com') ||
            href.includes('goo.gl/maps') ||
            href.includes('maps.apple.com') ||
            href.includes('maps.apple/') ||
            href.includes('waze.com') ||
            href.includes('bing.com/maps')
          ) {
            let appName = 'Google Maps'
            if (href.includes('apple.com') || href.includes('maps.apple/')) appName = 'Apple Maps'
            else if (href.includes('waze.com')) appName = 'Waze'
            else if (href.includes('bing.com')) appName = 'Bing Maps'

            umami.track('navigation-app-click', {
              app: appName,
              url: href,
              label,
              path: window.location.pathname
            })
            return
          }
          if (href.includes('direct-book.com') || href.includes('thebookingbutton.com')) {
            umami.track('booking-click', {
              url: href,
              label,
              path: window.location.pathname
            })
            return
          }
          if (href.includes('guest.chekin.com') || href.includes('chekin.com')) {
            umami.track('checkin-portal-click', {
              url: href,
              label,
              path: window.location.pathname
            })
            return
          }
          if (href.includes('boe.es')) {
            umami.track('legal-boe-click', {
              url: href,
              label,
              path: window.location.pathname
            })
            return
          }
        }

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
    
    // 3. Page/URL view duration tracking
    let pageStartTime = Date.now()
    
    const sendPageDuration = () => {
      const duration = Math.round((Date.now() - pageStartTime) / 1000)
      if (duration >= 2) {
        umami.track('page-view-duration', {
          duration,
          path: window.location.pathname
        })
      }
    }

    // Re-observe on page changes
    const router = useRouter()
    router.afterEach(() => {
      sendPageDuration()
      pageStartTime = Date.now()
      
      // Use a small delay to ensure the DOM has updated
      setTimeout(observeSections, 1000)
    })
    
    // Also handle visibility change (user leaves tab)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendPageDuration()
        
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
      } else {
        pageStartTime = Date.now()
      }
    })
  }
})
