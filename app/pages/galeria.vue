<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="galeria-page">
      <div class="galeria__header">
        <UiSectionTag>Galería</UiSectionTag>
        <h1 class="galeria__heading">Galería de habitaciones</h1>
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
const route  = useRoute()
const router = useRouter()

useHead({
  title: 'Galería de Habitaciones — Hostal Sol Zamora',
})

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
  margin: 0;
  padding: 0;
}
</style>
