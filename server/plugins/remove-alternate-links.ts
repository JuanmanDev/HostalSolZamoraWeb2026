export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    let linkHeader = getResponseHeader(event, 'link') || getResponseHeader(event, 'Link')
    if (!linkHeader) return

    if (Array.isArray(linkHeader)) {
      linkHeader = linkHeader.join(',')
    }

    if (typeof linkHeader === 'string') {
      const links = linkHeader.split(',').map(l => l.trim())
      const filtered = links.filter(l => !l.includes('rel="alternate"'))
      
      removeResponseHeader(event, 'link')
      removeResponseHeader(event, 'Link')
      
      if (filtered.length > 0) {
        setHeader(event, 'link', filtered.join(', '))
      }
    }
  })
})
