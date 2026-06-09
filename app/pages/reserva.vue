<template>
  <div>
        <main class="page-content">
      <div class="title__block">
        <div class="title__text">
          <UiSectionTag class="page-sub-heading">{{ t('nav.reserve') }}</UiSectionTag>
          <h1 class="page-heading" style="view-transition-name: page-heading">{{ t('pages.reserva.heading') }}</h1>
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

      <!-- Popup Fallback Card -->
      <Teleport to="body">
        <Transition name="slide-down-popup">
          <div 
            v-if="showPopup"
            class="fallback-booking-popup-wrapper"
          >
            <div
              class="fallback-booking-popup"
              @touchstart="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd"
              :style="{ transform: popupTransform, transition: isDragging ? 'none' : 'transform 0.3s ease' }"
            >
              <a :href="bookingUrl" target="_blank" rel="noopener noreferrer" class="fallback-booking-popup-link" @click="closePopup">
                <div class="fallback-booking-icon">
                  <LucideIcon name="external-link" :size="24" color="var(--green)" />
                </div>
                <div class="fallback-booking-content">
                  <h3 class="fallback-booking-title">{{ t('pages.reserva.fallbackTitle') }}</h3>
                  <p class="fallback-booking-subtitle">{{ t('pages.reserva.fallbackSubtitle') }}</p>
                </div>
              </a>
              <button class="fallback-booking-close" @click.prevent="closePopup" aria-label="Close">
                <LucideIcon name="x" :size="20" color="var(--dark)" />
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <a
        class="fallback-booking-card"
        :href="bookingUrl" target="_blank" rel="noopener noreferrer"
      >
        <div class="fallback-booking-icon">
          <LucideIcon name="external-link" :size="24" color="var(--green)" />
        </div>
        <div class="fallback-booking-content">
          <h3 class="fallback-booking-title">{{ t('pages.reserva.fallbackTitle') }}</h3>
          <p class="fallback-booking-subtitle">{{ t('pages.reserva.fallbackSubtitle') }}</p>
        </div>
        <div class="fallback-booking-arrow">
          <LucideIcon name="chevron-right" :size="20" color="var(--green)" />
        </div>
      </a>

      <!-- SiteMinder IBE Iframe -->
      <iframe
        ref="iframeEl"
        class="ibe-iframe"
        :src="bookingUrl"
        frameborder="0"
        scrolling="yes"
        title="Hostal Sol Zamora Booking"
        @load="onIframeLoad"
      ></iframe>

      <p class="trouble-text">
        {{ t('pages.reserva.troubleText') }}
        <a href="tel:+34980533152" class="trouble-link">{{ t('contact.phone1') }}</a>
      </p>

      <a
        class="fallback-booking-card fallback-booking-card--bottom"
        :href="bookingUrl" target="_blank" rel="noopener noreferrer"
      >
        <div class="fallback-booking-icon">
          <LucideIcon name="external-link" :size="24" color="var(--green)" />
        </div>
        <div class="fallback-booking-content">
          <h3 class="fallback-booking-title">{{ t('pages.reserva.fallbackTitle') }}</h3>
          <p class="fallback-booking-subtitle">{{ t('pages.reserva.fallbackSubtitle') }}</p>
        </div>
        <div class="fallback-booking-arrow">
          <LucideIcon name="chevron-right" :size="20" color="var(--green)" />
        </div>
      </a>
    </main>

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

const iframeEl = ref<HTMLIFrameElement | null>(null)

// Popup State
const showPopup = ref(false)
const popupDismissed = ref(false)
let popupAutoCloseTimer: ReturnType<typeof setTimeout> | null = null

function closePopup() {
  showPopup.value = false
  popupDismissed.value = true
  if (popupAutoCloseTimer) {
    clearTimeout(popupAutoCloseTimer)
  }
}

// Swipe logic
const touchStartX = ref(0)
const touchCurrentX = ref(0)
const isDragging = ref(false)
const popupTransform = computed(() => {
  if (!isDragging.value && touchStartX.value === 0) return ''
  const diff = touchCurrentX.value - touchStartX.value
  return `translateX(${diff}px)`
})

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
  touchCurrentX.value = e.touches[0].clientX
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  touchCurrentX.value = e.touches[0].clientX
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  const diff = touchCurrentX.value - touchStartX.value
  // Swipe threshold
  if (Math.abs(diff) > 80) {
    // Swipe away visual
    touchCurrentX.value = touchStartX.value + (Math.sign(diff) * window.innerWidth)
    setTimeout(() => {
      closePopup()
      touchStartX.value = 0
      touchCurrentX.value = 0
    }, 150) // wait for transition
  } else {
    // Snap back
    touchStartX.value = 0
    touchCurrentX.value = 0
  }
}

function onIframeLoad() {
  // Only scroll if the user is at the very top of the page
  setTimeout(() => {
    if (window.scrollY < 50 && iframeEl.value) {
      // 64 is the navbar height
      const top = iframeEl.value.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, 100)

  // Show popup after 20s
  setTimeout(() => {
    if (!popupDismissed.value) {
      showPopup.value = true
      
      // Auto-hide after 15s
      popupAutoCloseTimer = setTimeout(() => {
        if (showPopup.value) closePopup()
      }, 15000)
    }
  }, 20000)
}

onMounted(() => {
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('booking-funnel-start', {
      promocode: (route.query.promocode as string) || 'WEB',
      rateId: (route.query.rateId as string) || undefined,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
})
</script>

<style scoped>
.page-content {
  /* max-width: 1240px; Slightly wider container for the iframe */
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
  /* max-width: 1100px; */
  height: 2200px;
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
    height: calc(100vh - 64px); /* Fallback */
    height: calc(100dvh - 64px);
  }
}

.fallback-booking-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 24px;
  text-decoration: none;
  margin: 0 auto 24px;
  max-width: 800px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.fallback-booking-card--bottom {
  margin-top: 32px;
}

.fallback-booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-color: var(--green);
}

.fallback-booking-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--green-light, #eaf5ec);
  border-radius: 50%;
}

.fallback-booking-content {
  flex: 1;
}

.fallback-booking-title {
  color: var(--dark);
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.fallback-booking-subtitle {
  color: var(--dark-muted);
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.fallback-booking-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .fallback-booking-card {
    margin: 0 16px 24px;
    padding: 16px;
    gap: 12px;
  }
  .fallback-booking-title {
    font-size: 15px;
  }
  .fallback-booking-subtitle {
    font-size: 13px;
  }
}

/* Popup styles */
.fallback-booking-popup-wrapper {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  pointer-events: none;
}

.fallback-booking-popup {
  pointer-events: auto;
  display: flex;
  align-items: center;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}

.fallback-booking-popup-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 48px 16px 24px;
  text-decoration: none;
  flex: 1;
}

@media (max-width: 768px) {
  .fallback-booking-popup-link {
    padding: 16px 48px 16px 16px;
    gap: 12px;
  }
}

.fallback-booking-close {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.fallback-booking-close:hover {
  background: rgba(0,0,0,0.05);
}

.slide-down-popup-enter-active,
.slide-down-popup-leave-active {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
}
.slide-down-popup-enter-from,
.slide-down-popup-leave-to {
  opacity: 0;
  transform: translateY(-150%);
}
</style>
