/**
 * useSeo — single source of truth for per-page meta.
 *
 * Wires up <title>, description, canonical, OG (Facebook), Twitter card,
 * and hreflang/x-default alternates from @nuxtjs/i18n's locale routes.
 *
 * Usage in any page:
 *   useSeo({
 *     title:       computed(() => t('pages.faq.title')),
 *     description: computed(() => t('pages.faq.description')),
 *     image:       '/images/hero/hero-1.jpg',  // optional, falls back to default OG
 *     type:        'website',                  // or 'article'
 *   })
 *
 * The composable is pure (no DOM / no SSR-only branches), so it's safe
 * to call from <script setup>.
 */
import { computed, unref, type MaybeRef } from 'vue'

interface SeoOptions {
  title?:        MaybeRef<string | undefined>
  description?:  MaybeRef<string | undefined>
  image?:        MaybeRef<string | undefined>
  type?:         'website' | 'article'
  noIndex?:      boolean
  /** Optional override of the canonical path (defaults to current route) */
  canonicalPath?: MaybeRef<string | undefined>
}

export function useSeo(opts: SeoOptions = {}) {
  const route       = useRoute()
  const config      = useRuntimeConfig()
  const i18n        = useI18n()
  const i18nHead    = useLocaleHead({ dir: true, lang: true, seo: true })
  const localePath  = useLocalePath()
  const switchPath  = useSwitchLocalePath()

  const siteUrl  = (config.public.siteUrl as string).replace(/\/$/, '')
  const siteName = (config.public.siteName as string) || 'Hostal Sol Zamora'

  const fullUrl = (path: string) => `${siteUrl}${path.startsWith('/') ? path : '/' + path}`

  const canonical = computed(() => {
    const override = unref(opts.canonicalPath)
    return fullUrl(override ?? route.path)
  })

  const ogImageUrl = computed(() => {
    const img = unref(opts.image) ?? (config.public.defaultOgImage as string)
    if (!img) return undefined
    return img.startsWith('http') ? img : fullUrl(img)
  })

  const titleVal = computed(() => unref(opts.title) || siteName)
  const descVal  = computed(() => unref(opts.description) || '')

  // hreflang alternates — one per locale, plus x-default = es (default locale)
  const alternates = computed(() => {
    const links: Array<{ rel: string; hreflang: string; href: string }> = []
    for (const loc of i18n.locales.value as Array<{ code: string; language?: string }>) {
      const path = switchPath(loc.code as Parameters<typeof switchPath>[0])
      if (!path) continue
      links.push({
        rel: 'alternate',
        hreflang: loc.language || loc.code,
        href: fullUrl(path),
      })
    }
    // x-default points to the default locale (Spanish)
    const defaultPath = switchPath(i18n.defaultLocale as Parameters<typeof switchPath>[0]) || '/'
    links.push({ rel: 'alternate', hreflang: 'x-default', href: fullUrl(defaultPath) })
    return links
  })

  const currentLocaleCode = computed(() => i18n.locale.value as string)
  const currentLocaleObj  = computed(() =>
    (i18n.locales.value as Array<{ code: string; language?: string }>)
      .find(l => l.code === currentLocaleCode.value)
  )
  const ogLocale = computed(() => {
    const lang = currentLocaleObj.value?.language || 'es-ES'
    return lang.replace('-', '_')
  })

  // Function form — re-evaluates reactively on locale / route change
  useHead(() => {
    const title = titleVal.value
    const desc  = descVal.value
    const img   = ogImageUrl.value
    const og    = ogLocale.value
    const can   = canonical.value

    return {
      htmlAttrs: i18nHead.value.htmlAttrs ?? { lang: currentLocaleCode.value },
      title,
      link: [
        { rel: 'canonical', href: can },
        ...alternates.value,
      ],
      meta: [
        unref(opts.noIndex)
          ? { name: 'robots', content: 'noindex, nofollow' }
          : { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'description',      content: desc },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title',     content: title },
        { property: 'og:description', content: desc },
        { property: 'og:type',      content: opts.type || 'website' },
        { property: 'og:url',       content: can },
        { property: 'og:locale',    content: og },
        ...(i18n.locales.value as Array<{ code: string; language?: string }>)
          .filter(l => l.code !== currentLocaleCode.value)
          .map(l => ({
            property: 'og:locale:alternate',
            content: (l.language || l.code).replace('-', '_'),
          })),
        ...(img ? [
          { property: 'og:image',        content: img,   key: 'og:image' },
          { property: 'og:image:alt',    content: title, key: 'og:image:alt' },
          { property: 'og:image:width',  content: '1200', key: 'og:image:width' },
          { property: 'og:image:height', content: '630',  key: 'og:image:height' },
        ] : []),
        { name: 'twitter:card',        content: 'summary_large_image', key: 'twitter:card' },
        { name: 'twitter:title',       content: title,  key: 'twitter:title' },
        { name: 'twitter:description', content: desc,   key: 'twitter:description' },
        ...(img ? [{ name: 'twitter:image', content: img, key: 'twitter:image' }] : []),
      ],
    }
  })

  return { canonical, ogImageUrl, alternates }
}

/**
 * useJsonLd — inject one (or more) JSON-LD documents into the page head.
 * Wraps useHead with the right script type + serialization.
 */
export function useJsonLd(data: object | object[]) {
  const items = Array.isArray(data) ? data : [data]
  useHead({
    script: items.map((doc, i) => ({
      key: `ld-json-${i}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(doc),
    })),
  })
}
