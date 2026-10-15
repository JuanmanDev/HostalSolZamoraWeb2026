<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()
const config     = useRuntimeConfig()

const RTL_LOCALES = ['ar', 'he', 'fa']
const isRtl = computed(() => RTL_LOCALES.includes(locale.value))

const i18nHead = useLocaleHead()

// Keep <html lang/dir> in sync with the active locale. Canonical, hreflang and
// og:locale come from useSeo() on every page — emitting them here as well
// produced two competing hreflang sets (bare and region codes) and an
// x-default pointing at the current page.
useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
    ...i18nHead.value.htmlAttrs,
  },
}))

// Site-wide knowledge graph: one Organization + one LodgingBusiness, emitted on
// every page so inner pages can reference `/#lodging` and `/#organization`.
const siteUrl  = (config.public.siteUrl as string).replace(/\/$/, '')
const siteName = config.public.siteName as string

const SAME_AS = [
  'https://www.instagram.com/hostalsolzamora/',
  'https://www.facebook.com/hostalsolzam',
  'https://www.youtube.com/@HostalSolZamora',
  'https://maps.google.com/maps?cid=2829160904761521734',
  'https://www.booking.com/hotel/es/hostal-sol-zamora.es.html',
  'https://www.expedia.es/Zamora-Hoteles-Hostal-Sol.h101083476.Informacion-Hotel',
]

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/apple-touch-icon.png`,
        contentUrl: `${siteUrl}/apple-touch-icon.png`,
        width: 180,
        height: 180,
      },
      sameAs: SAME_AS,
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+34-980-533-152',
        email: 'hostalsol@outlook.com',
        contactType: 'reservations',
        areaServed: 'ES',
        availableLanguage: ['Spanish'],
      }],
    },
    {
      '@type': 'LodgingBusiness',
      '@id': `${siteUrl}/#lodging`,
      name: siteName,
      description: t('pages.home.description'),
      url: siteUrl,
      parentOrganization: { '@id': `${siteUrl}/#organization` },
      telephone: '+34-980-533-152',
      email: 'hostalsol@outlook.com',
      image: [
        `${siteUrl}/images/hero/hero-1.jpg`,
        `${siteUrl}/images/hero/hero-2.jpg`,
        `${siteUrl}/images/about.webp`,
      ],
      logo: `${siteUrl}/apple-touch-icon.png`,
      priceRange: 'Desde 40 € / noche',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Benavente, 2, 3ª planta',
        addressLocality: 'Zamora',
        addressRegion: 'Castilla y León',
        postalCode: '49014',
        addressCountry: 'ES',
      },
      // Google Business Profile pin
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.5058038,
        longitude: -5.7439899,
      },
      hasMap: 'https://maps.google.com/maps?cid=2829160904761521734',
      checkinTime: '14:00',
      checkoutTime: '11:00',
      numberOfRooms: 17,
      petsAllowed: true,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Free WiFi',          value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air conditioning',   value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Heating',            value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Private bathroom',   value: true },
        { '@type': 'LocationFeatureSpecification', name: 'TV',                 value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Daily housekeeping', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet friendly',       value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Elevator',           value: true },
      ],
      sameAs: SAME_AS,
    },
  ],
}, 'site')
</script>
