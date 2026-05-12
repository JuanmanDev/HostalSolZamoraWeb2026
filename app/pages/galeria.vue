<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="galeria-page">
      <div class="galeria__header">
        <UiSectionTag>{{ t('pages.galeria.tag') }}</UiSectionTag>
        <h1 class="galeria__heading">{{ t('pages.galeria.heading') }}</h1>
      </div>

      <div class="galeria__header">
        <p class="galeria__text">{{ t('pages.galeria.p1') }}</p>
        <p class="galeria__text">{{ t('pages.galeria.p2') }}</p>
        <p class="galeria__text">{{ t('pages.galeria.p3') }}</p>
        <p class="galeria__text">{{ t('pages.galeria.p4') }}</p>

        <!-- Lista de todas las características de las habtaionces del hostal -->
         <SectionsRoomAmenityChipsTranslated baseKey="rooms.amenities" />
      </div>

      <!-- Room Media Gallery -->
      <section class="galeria__gallery">
        <SectionsRoomMediaGallery2
          :initial-room="activeRoom"
          :initial-media="mediaFilter"
          @update:room="onRoomChange"
          @update:media="onMediaChange"
        />
      </section>


      <br />
      <br />
      <br />
      <br />
      <br />
<!--       
        <SectionsRoomMediaGallery
          :initial-room="activeRoom"
          :initial-media="mediaFilter"
          @update:room="onRoomChange"
          @update:media="onMediaChange"
        /> -->
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route  = useRoute()
const router = useRouter()

useSeo({
  title:       computed(() => t('pages.galeria.title')),
  description: computed(() => t('pages.galeria.description')),
  type:        'website',
  image:       '/images/about.webp',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.galeria.title'),
  subtitle: t('pages.galeria.description'),
})

const cfg     = useRuntimeConfig()
const siteUrl = (cfg.public.siteUrl as string).replace(/\/$/, '')

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('pages.galeria.title'),
    description: t('pages.galeria.description'),
    url: `${siteUrl}${route.path}`,
    isPartOf: { '@type': 'LodgingBusiness', '@id': `${siteUrl}/#lodging` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('nav.home'), item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: t('pages.galeria.heading'), item: `${siteUrl}${route.path}` },
    ],
  },
])

// ── Filter state ──────────────────────────────────────────────────────────────
const activeRoom  = ref<string>((route.query.room as string) || 'All')
const mediaFilter = ref<'all' | 'photos' | 'videos'>((route.query.media as 'all' | 'photos' | 'videos') || 'all')

function pushQuery() {
  router.push({
    query: {
      room:  activeRoom.value,
      media: mediaFilter.value,
    },
  })
}

function onMediaChange(key: 'all' | 'photos' | 'videos') {
  mediaFilter.value  = key
  pushQuery()
}

function onRoomChange(key: string) {
  activeRoom.value   = key
  pushQuery()
}
</script>

<style scoped>
/* ── Page layout ─────────────────────────────────────────────────────────── */
.galeria-page {
  padding-top: 80px;
  padding-bottom: 80px;
}

.galeria__header {
  padding: 32px max(24px, 5vw) 0;
}

.galeria__heading {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  line-height: 1.15;
  color: var(--dark);
  margin: 8px 0 28px;
}

/* ── Gallery carousel ───────────────────────────────────────────────────── */
.galeria__gallery {
  margin: 2rem 0;
  padding: 0;
}

/* ── Text blocks ───────────────────────────────────────────────────── */
.galeria__text {

  color: var(--dark-muted);
  margin: 0 0 20px;
  line-height: 1.6;
}
</style>
