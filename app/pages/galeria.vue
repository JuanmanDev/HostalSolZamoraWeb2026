<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="galeria-page">
      <div class="galeria__header">
        <UiSectionTag>Galería</UiSectionTag>
        <h1 class="galeria__heading">Galería de habitaciones</h1>
      </div>

      <div class="galeria__header">
        <!-- Texto sobre que queremos ser transparentes sobre cómo son las habitaciones y todas sus características -->

        <p class="galeria__text">
          En Hostal Sol Zamora creemos que la transparencia es clave para que nuestros huéspedes puedan tomar decisiones informadas sobre su alojamiento. Por eso, en esta sección encontrarás una galería completa de imágenes y vídeos de nuestras habitaciones, mostrando cada detalle para que puedas ver exactamente lo que ofrecemos antes de reservar. Queremos que te sientas seguro y confiado al elegirnos como tu lugar de descanso en el centro histórico de Zamora.
        </p>
        <p class="galeria__text">
          Nuestra galería incluye fotos de alta calidad que muestran la decoración, el mobiliario, las vistas desde las ventanas y los servicios disponibles en cada tipo de habitación. Además, también encontrarás vídeos que te permitirán hacer un recorrido virtual por nuestras instalaciones, para que puedas experimentar la atmósfera acogedora y el ambiente único que ofrecemos. En Hostal Sol Zamora, nos esforzamos por brindarte una experiencia auténtica y transparente desde el primer momento.
        </p>
        <p class="galeria__text">
          Si tienes alguna pregunta sobre nuestras habitaciones o necesitas más información, no dudes en contactarnos. Estamos aquí para ayudarte a encontrar la opción de alojamiento perfecta para tu estancia en Zamora. ¡Explora nuestra galería y descubre por qué Hostal Sol Zamora es la elección ideal para tu próxima visita!
        </p>
        <p class="galeria__text">
          Las fotos fueron realizadas en 2024 y los vídeos en 2026, por lo que es posible que algunas de las imágenes no reflejen el estado actual de las habitaciones, ya que hemos realizado mejoras y renovaciones desde entonces. Sin embargo, nos esforzamos por mantener la galería lo más actualizada posible para ofrecerte una visión precisa de lo que puedes esperar durante tu estancia con nosotros.
        </p>

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
  margin: 2rem 0;
  padding: 0;
}

/* ── Text blocks ───────────────────────────────────────────────────────── */
.galeria__text {
  
  color: var(--dark-muted);
  margin: 0 0 20px;
  line-height: 1.6;
}
</style>
