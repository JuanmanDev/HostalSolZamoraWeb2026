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

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-ai-ready',
    'nuxt-link-checker',
    'nuxt-schema-org',
    'nuxt-seo-utils',
    'nuxt-skew-protection',
    'nuxt-umami'
  ],

  linkChecker: {
    enabled: true,
    runOnBuild: true,
    // Ignore the base URL case because GitHub Pages requires the repo name case
    excludeLinks: [
      '/HostalSolZamoraWeb2026/**',
      'https://hostalsolzamora.com/**',
    ],
    // Skip checking certain rules that are too noisy or unavoidable
    skipInspections: [
      'no-uppercase-chars',
      'link-text',
      'no-trailing-slash',
    ],
    // Only report real errors (404s) to keep logs clean
    report: {
      html: false,
      markdown: false,
    },
    showLiveInspections: false,
  },

  umami: {
    host: 'https://umami.hostalsol.79.72.51.163.nip.io',
    id: '9afca95c-0468-4ef2-adb0-5bfc7bf15889',
    ignoreLocalhost: true,
    autoTrack: true,
  },

  // ── Site identity (sitemap, robots, og-image read this) ───────────────────
  site: {
    url: 'https://hostalsolzamora.com',
    name: 'Hostal Sol Zamora',
    description: 'Hostal boutique en el centro histórico de Zamora. Habitaciones nórdicas, baño privado, WiFi y mejor precio garantizado.',
    defaultLocale: 'es',
    trailingSlash: false,
    indexable: true,
  },

  // ── Sitemap ────────────────────────────────────────────────────────────────
  sitemap: {
    xsl: false,
    credits: false,
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    sitemap: 'https://hostalsolzamora.com/sitemap.xml',
    allow:   ['/llms.txt'],
    disallow: [
      '/politica-de-cookies-ue',
      '/en/cookie-policy',
      '/terminos-y-condiciones',
      '/en/terms-and-conditions',
    ],
    // AI crawlers welcome — llms.txt provides machine-readable site info
    blockAiBots: false,
  },

  // ── OG Image ───────────────────────────────────────────────────────────────
  ogImage: {
    enabled: true,
  },

  // Public runtime config — overridable with NUXT_PUBLIC_SITE_URL env var
  runtimeConfig: {
    public: {
      siteUrl: 'https://hostalsolzamora.com',
      siteName: 'Hostal Sol Zamora',
      defaultOgImage: '/images/og-default.jpg',
    },
  },

  vite: {
    server: {
      allowedHosts: ['89a4-79-116-52-42.ngrok-free.app'],
    },
  },

  image: {
    dir: join(process.cwd(), 'public'),
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
      '3xl': 2560,
      '4k': 3840
    },
    densities: [1, 2],
    quality: 90,
    format: ['webp', 'avif', 'jpg'],
    sharp: {
      rotate: true
    },
    ipx: {
      sharpOptions: {
        autoOrient: true,
      },
    },
  },

  css: ['~/assets/css/main.css', 'vue3-carousel/dist/carousel.css'],

  appConfig: {
    roomImages,
  },

  i18n: {
    bundle: { optimizeTranslationDirective: false },
    langDir: 'locales',
    locales: [
      { code: 'es', file: 'es.json', name: 'Español',    language: 'es-ES' },
      { code: 'en', file: 'en.json', name: 'English',    language: 'en-GB' },
      { code: 'pt', file: 'pt.json', name: 'Português',  language: 'pt-PT' },
      { code: 'fr', file: 'fr.json', name: 'Français',   language: 'fr-FR' },
      { code: 'de', file: 'de.json', name: 'Deutsch',    language: 'de-DE' },
      { code: 'it', file: 'it.json', name: 'Italiano',   language: 'it-IT' },
      { code: 'nl', file: 'nl.json', name: 'Nederlands', language: 'nl-NL' },
      { code: 'ro', file: 'ro.json', name: 'Română',     language: 'ro-RO' },
      { code: 'ru', file: 'ru.json', name: 'Русский',    language: 'ru-RU' },
      { code: 'uk', file: 'uk.json', name: 'Українська', language: 'uk-UA' },
      { code: 'pl', file: 'pl.json', name: 'Polski',     language: 'pl-PL' },
      { code: 'el', file: 'el.json', name: 'Ελληνικά',   language: 'el-GR' },
      { code: 'gl', file: 'gl.json', name: 'Galego',     language: 'gl-ES' },
      { code: 'ca', file: 'ca.json', name: 'Català',     language: 'ca-ES' },
      { code: 'eu', file: 'eu.json', name: 'Euskara',    language: 'eu-ES' },
      { code: 'ar', file: 'ar.json', name: 'العربية',    language: 'ar-MA', dir: 'rtl' },
      { code: 'zh', file: 'zh.json', name: '中文',        language: 'zh-CN' },
      { code: 'ko', file: 'ko.json', name: '한국어',       language: 'ko-KR' },
      { code: 'ja', file: 'ja.json', name: '日本語',       language: 'ja-JP' },
      { code: 'wo', file: 'wo.json', name: 'Wolof',      language: 'wo-SN' },
      { code: 'ber', file: 'ber.json', name: 'Tamaziɣt', language: 'ber-MA' },
    ],
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'hsz_lang',
      redirectOn: 'root',
      fallbackLocale: 'es',
    },
    baseUrl: 'https://hostalsolzamora.com',
    pages: {
      'index':                    { en: '/', es: '/' },
      'galeria':                  { en: '/gallery', es: '/galeria' },
      'reserva':                  { en: '/booking', es: '/reserva' },
      'checkin':                  { en: '/check-in', es: '/checkin' },
      'faq':                      { en: '/faq', es: '/faq' },
      'parking':                  { en: '/parking', es: '/parking' },
      'contacto':                 { en: '/contact', es: '/contacto' },
      'sobre-nosotros':           { en: '/about', es: '/sobre-nosotros' },
      'politica-de-cookies-ue':   { en: '/cookie-policy', es: '/politica-de-cookies-ue' },
      'terminos-y-condiciones':   { en: '/terms-and-conditions', es: '/terminos-y-condiciones' },
    },
  },

  // Route rules: 301-redirect old WordPress URLs to new equivalents,
  // pre-render every page at build time, and set aggressive cache
  // headers for static asset paths.
  routeRules: {
    // Legacy WordPress URLs → new Nuxt routes
    '/habitaciones':              { redirect: { to: '/galeria',                statusCode: 301 } },
    '/sobre-nosotros-cercania':   { redirect: { to: '/sobre-nosotros',         statusCode: 301 } },
    '/aviso-legal':               { redirect: { to: '/terminos-y-condiciones', statusCode: 301 } },
    '/ifeza':                     { redirect: { to: '/parking',                statusCode: 301 } },

    // Disable OG Image generation for non-Spanish locales to speed up build
    // (They will fall back to the defaultOgImage defined in runtimeConfig)
    '/en/**': { ogImage: false },
    '/pt/**': { ogImage: false },
    '/fr/**': { ogImage: false },
    '/de/**': { ogImage: false },
    '/it/**': { ogImage: false },
    '/nl/**': { ogImage: false },
    '/ro/**': { ogImage: false },
    '/ru/**': { ogImage: false },
    '/uk/**': { ogImage: false },
    '/pl/**': { ogImage: false },
    '/el/**': { ogImage: false },
    '/gl/**': { ogImage: false },
    '/ca/**': { ogImage: false },
    '/eu/**': { ogImage: false },
    '/ar/**': { ogImage: false },
    '/zh/**': { ogImage: false },
    '/ko/**': { ogImage: false },
    '/ja/**': { ogImage: false },
    '/wo/**': { ogImage: false },
    '/ber/**': { ogImage: false },

    // Aggressively cache fingerprinted assets (Nuxt build output + IPX images).
    // The hash in the filename means the URL changes whenever the content changes,
    // so a 1-year immutable cache is safe.
    '/_nuxt/**':                  { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_ipx/**':                   { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Static images in /public — long-cache but not immutable (filenames are stable).
    '/images/**':                 { headers: { 'cache-control': 'public, max-age=2592000, stale-while-revalidate=86400' } },

    // Pre-render every page at build time for max performance.
    '/**':                        { prerender: true },
  },

  // Crawler follows internal links so prerender catches every page
  // declared in i18n.pages. /sitemap.xml and /robots.txt are emitted
  // by their respective modules and don't need explicit listing.
  nitro: {
    prerender: {
      crawlLinks: true,
      ignoreErrors: true,
      concurrency: 2, // Slightly more aggressive but still safe
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://direct-book.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://www.youtube.com' },
        { rel: 'dns-prefetch', href: 'https://maps.google.com' },
        // Favicons & manifest (files added under /public)
        { rel: 'icon',             href: '/favicon.ico',          sizes: 'any' },
        { rel: 'icon',             href: '/favicon.svg',          type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest',         href: '/site.webmanifest' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        },
      ],
      meta: [
        { name: 'theme-color',                content: '#687e56' },
        { name: 'format-detection',           content: 'telephone=no' },
        { name: 'apple-mobile-web-app-title', content: 'Hostal Sol' },
        { name: 'application-name',           content: 'Hostal Sol Zamora' },
      ],
    },
  },
})