<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const config     = useRuntimeConfig()

const RTL_LOCALES = ['ar', 'he', 'fa']
const isRtl = computed(() => RTL_LOCALES.includes(locale.value))

const i18nHead = useLocaleHead({ addSeoAttributes: true })

// Site-wide Organization schema (one knowledge-graph entry for the brand).
const siteUrl  = (config.public.siteUrl as string).replace(/\/$/, '')
const siteName = config.public.siteName as string

// Keep <html lang> in sync with the active i18n locale, and add SEO meta/links.
useHead(() => {
  const absoluteLinks = i18nHead.value.link?.map(l => {
    if (l.href && l.href.startsWith('/')) {
      return { ...l, href: `${siteUrl}${l.href}` }
    }
    return l
  }) || []

  // Ensure canonical link is present
  const hasCanonical = absoluteLinks.some(l => l.rel === 'canonical')
  if (!hasCanonical) {
    const path = useRoute().path
    absoluteLinks.push({ rel: 'canonical', href: `${siteUrl}${path}` })
  }

  return {
    htmlAttrs: {
      lang: locale.value,
      ...i18nHead.value.htmlAttrs
    },
    meta: i18nHead.value.meta,
    link: absoluteLinks
  }
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/images/logo.svg`,
    contentUrl: `${siteUrl}/images/logo.svg`,
  },
  sameAs: [
    'https://www.instagram.com/hostalsolzamora/',
    'https://www.facebook.com/hostalsolzam',
  ],
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+34-980-533-152',
    contactType: 'reservations',
    areaServed: 'ES',
    availableLanguage: ['Spanish', 'English'],
  }],
})
</script>
