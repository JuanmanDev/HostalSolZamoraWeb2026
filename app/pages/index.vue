<template>
  <div>
    <LayoutTheNavbar />
    <main>
      <SectionsHeroSection />
      <SectionsAboutSection />
      <SectionsRoomsSection />
      <SectionsMapSection />
      <SectionsParkingSection />
      <SectionsReviewsSection />
      <SectionsRecommendationSection />
      <SectionsFaqSection />
      <SectionsReservationSection />
    </main>
    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: 'Hostal Sol Zamora — Tu alojamiento en el centro histórico',
  meta: [
    { name: 'description', content: t('hero.sub') },
    { property: 'og:title',       content: 'Hostal Sol Zamora' },
    { property: 'og:description', content: t('hero.sub') },
    { property: 'og:type',        content: 'website' },
  ],
})
</script>
