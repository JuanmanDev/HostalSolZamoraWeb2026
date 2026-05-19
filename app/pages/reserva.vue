<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <div class="title__block">
        <div class="title__text">
          <UiSectionTag class="page-sub-heading">{{ t('nav.reserve') }}</UiSectionTag>
          <h1 class="page-heading">{{ t('pages.reserva.heading') }}</h1>
        </div>
        <div class="title__discount">
          <SectionsDiscountCard3d>
            <template #num><div class="reserve__discount-num">{{ t('reserve.discountNum') }}</div></template>
            <template #label><div class="reserve__discount-label">{{ t('reserve.discountLabel') }}</div></template>
            <template #note><div class="reserve__discount-note">{{ t('reserve.discountNote') }}</div></template>
          </SectionsDiscountCard3d>
        </div>
      </div>




      <!-- Feature chips -->
      <div class="features">
        <div v-for="(feat, i) in features" :key="i" class="feature-chip">
          <LucideIcon :name="featIcons[i] ?? 'star'" :size="16" color="var(--green)" />
          {{ feat }}
        </div>
      </div>

      <!-- SiteMinder IBE Iframe -->
      <iframe
        class="ibe-iframe"
        :src="bookingUrl"
        frameborder="0"
        scrolling="yes"
        title="Hostal Sol Zamora Booking"
      ></iframe>

      <p class="trouble-text">
        {{ t('pages.reserva.troubleText') }}
        <a href="tel:+34980533152" class="trouble-link">{{ t('contact.phone1') }}</a>
      </p>

      <a
        class="link-to-reservation"
        :href="bookingUrl" target="_blank" rel="noopener noreferrer"
      >
        {{ t('pages.reserva.iframeFallback') }}
      </a>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt, locale } = useI18n()
const route = useRoute()

const SITEMINDER_LOCALES = new Set(['en', 'es', 'fr', 'de', 'it', 'nl', 'pt', 'ru', 'zh', 'ko', 'ja', 'pl', 'ro', 'el', 'ar', 'ca'])
const siteMinderLocale = computed(() => SITEMINDER_LOCALES.has(locale.value) ? locale.value : 'en')

const bookingUrl = computed(() => {
  // Use 'WEB' as the default promocode unless one is provided in the URL query
  const queryPromocode = route.query.promocode as string | undefined
  const finalPromocode = queryPromocode || 'WEB'

  const realLocal = locale.value === 'es' ? 'es' : 'en';
  
  const base = `https://app.thebookingbutton.com/properties/hostalsoldirect?skin=0&locale=${realLocal}&promocode=${finalPromocode}&currency=EUR&trackPage=no`
  const rateId = route.query.rateId as string | undefined
  
  if (!rateId) return base
  return `${base}&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&items[0][rateId]=${rateId}`
})

useSeo({
  title:       computed(() => t('pages.reserva.title')),
  description: computed(() => t('pages.reserva.description')),
  type:        'website',
  image:       '/images/hero/hero-1.jpg',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.reserva.title'),
  subtitle: t('pages.reserva.description'),
})

const cfg     = useRuntimeConfig()
const siteUrl = (cfg.public.siteUrl as string).replace(/\/$/, '')
useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: t('pages.reserva.title'),
  url: `${siteUrl}${route.path}`,
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      
      urlTemplate: `https://direct-book.com/properties/hostalsoldirect?promocode=${route.query.promocode || 'WEB'}`,
      inLanguage: 'es-ES',
      actionPlatform: ['http://schema.org/DesktopWebPlatform','http://schema.org/MobileWebPlatform'],
    },
    result: { '@type': 'LodgingReservation', name: 'Reserva en Hostal Sol Zamora' },
  },
})

const features  = computed(() =>
  (tm('pages.reserva.features') as any[]).map((f: any) => rt(f)) as string[]
)
const featIcons = ['zap', 'shield-check', 'lock', 'x-circle']

</script>

<style scoped>
.page-content {
  max-width: 1240px; /* Slightly wider container for the iframe */
  margin: 0 auto;
  padding: 92px 0 80px;
}

.title__block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  padding: 0 max(24px, 5vw); /* Add padding to title block */
}

@media (max-width: 768px) {
  .title__block {
    justify-content: center
  }
}

.page-sub-heading, .page-heading, .discount-banner {
  /* No global side margin here, handled by title__block and features container */
}

.page-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 20px;
}

.features {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  margin-bottom: 28px;
  overflow-y: auto;
  padding: 0 max(24px, 5vw); /* Match page alignment */
  scrollbar-width: none;
}

.feature-chip {
  background: #fff;
  border-radius: 10px;
  flex-shrink: 0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.trouble-text {
  display: none;
  color: var(--dark-muted);
  font-size: 13px;
  margin-top: 14px;
  text-align: center;
}
.trouble-link { color: var(--green); font-weight: 700; margin-left: 4px; }

.ibe-iframe {
  width: 100%; /* Minimal margin on bigger screens */
  max-width: 1100px;
  height: 2700px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  margin: 0 auto;
  display: block;
}

@media (max-width: 768px) {
  .ibe-iframe {
    width: 100%; /* Full width on mobile */
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 2500px; /* Taller for mobile layout */
  }
}

.link-to-reservation {
  display: block;
  width: fit-content;
  max-width: calc(100% - 2rem);
  margin: 32px auto 0;
  text-align: center;

  background: var(--green);
  color: white;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
