<template>
  <div>
        <main>
      <SectionsHeroSection id="hero" />
      <SectionsAboutSection id="about" />
      <!-- Server-rendered, hydrated only when scrolled into view -->
      <LazySectionsRoomsSection id="rooms" hydrate-on-visible />
      <LazySectionsMapSection id="map" />
      <LazySectionsParkingSection id="parking" hydrate-on-visible />
      <LazySectionsReviewsSection id="reviews" hydrate-on-visible />
      <LazySectionsRecommendationSection id="recommendation" hydrate-on-visible />
      <LazySectionsFaqSection id="faq" hydrate-on-visible />
      <LazySectionsReservationSection id="reservation" hydrate-on-visible />
    </main>
      </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

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

// LodgingBusiness + Organization JSON-LD is emitted site-wide from app.vue.
</script>
