<template>
  <div>
        <main>
      <SectionsHeroSection id="hero" />
      <SectionsAboutSection id="about" />
      <SectionsRoomsSection id="rooms" />
      <SectionsMapSection id="map" />
      <SectionsParkingSection id="parking" />
      <SectionsReviewsSection id="reviews" />
      <SectionsRecommendationSection id="recommendation" />
      <SectionsFaqSection id="faq" />
      <SectionsReservationSection id="reservation" />
    </main>
      </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()

// Per-page SEO (canonical + hreflang + OG + Twitter, all i18n-aware)
useSeo({
  title:       computed(() => t('pages.home.title')),
  description: computed(() => t('pages.home.description')),
  type:        'website',
  image:       '/images/hero/hero-1.jpg',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.home.title'),
  subtitle: t('pages.home.description'),
})

// Schema.org JSON-LD: LodgingBusiness — Google's rich-result-eligible
// schema for hotels and similar accommodations.
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': `${siteUrl}/#lodging`,
  name: 'Hostal Sol Zamora',
  description: 'Hostal boutique con estilo nórdico en el centro histórico de Zamora, España.',
  url: siteUrl,
  telephone: '+34-980-533-152',
  email: 'hostalsol@outlook.com',
  image: [
    `${siteUrl}/images/hero/hero-1.jpg`,
    `${siteUrl}/images/hero/hero-2.jpg`,
    `${siteUrl}/images/about.webp`,
  ],
  logo: `${siteUrl}/images/logo.svg`,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Benavente, 2 — 3ª planta',
    addressLocality: 'Zamora',
    addressRegion: 'Castilla y León',
    postalCode: '49014',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.5067,
    longitude: -5.7428,
  },
  hasMap: 'https://goo.gl/maps/689g4UmPLFAGKsEq8',
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
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '10:00', closes: '21:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 7.7,
    bestRating: 10,
    worstRating: 0,
    ratingCount: 500,
  },
  sameAs: [
    'https://www.instagram.com/hostalsolzamora/',
    'https://www.facebook.com/hostalsolzam',
  ],
})
</script>
