import { readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Build-time discovery of room images
const roomsDir = join(process.cwd(), 'public/images/rooms')
const roomImages: Record<string, string[]> = {}

if (existsSync(roomsDir)) {
  const entries = readdirSync(roomsDir)
  for (const entry of entries) {
    const fullPath = join(roomsDir, entry)
    if (statSync(fullPath).isDirectory()) {
      const files = readdirSync(fullPath)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
        .map(f => `/images/rooms/${entry}/${f}`)
      
      if (files.length > 0) {
        roomImages[entry] = files
      }
    }
  }
  
  const rootFiles = readdirSync(roomsDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => `/images/rooms/${f}`)
  
  if (rootFiles.length > 0) {
    roomImages['General'] = rootFiles
    if (!roomImages['Entrada']) {
      roomImages['Entrada'] = rootFiles
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxtjs/i18n', '@nuxt/scripts'],

  css: ['~/assets/css/main.css', 'vue3-carousel/dist/carousel.css'],

  appConfig: {
    roomImages,
  },

  i18n: {
    bundle: { optimizeTranslationDirective: false },
    langDir: 'locales',
    locales: [
      { code: 'es', file: 'es.json', name: 'Español' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'es',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'hsz_lang',
      redirectOn: 'root',
      fallbackLocale: 'es',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
