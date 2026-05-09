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

      <!-- Discount banner -->
      <!-- <div class="discount-banner">
        <LucideIcon name="tag" :size="22" color="#fff" />
        <div class="discount-banner__text">
          <div class="discount-banner__label">{{ t('pages.reserva.discountLabel') }}</div>
          <div class="discount-banner__sub">{{ t('pages.reserva.discountSub') }}</div>
        </div>
        <div class="discount-banner__badge">−15%</div>
      </div> -->

      

      <!-- Feature chips -->
      <div class="features">
        <div v-for="(feat, i) in features" :key="i" class="feature-chip">
          <LucideIcon :name="featIcons[i] ?? 'star'" :size="16" color="var(--green)" />
          {{ feat }}
        </div>
      </div>

      <!-- Booking iframe -->
      <div class="iframe-wrap">
        <iframe
          ref="iframeEl"
          :src="bookingUrl"
          :title="t('pages.reserva.iframeTitle')"
          class="booking-iframe"
          allow="payment"
          @load="onLoad"
        />
      </div>

      <p class="trouble-text">
        {{ t('pages.reserva.troubleText') }}
        <a href="tel:+34980533152" class="trouble-link">{{ t('contact.phone1') }}</a>
      </p>

      <a 
        class="link-to-reservation"
        :href="bookingUrl" target="_blank" rel="noopener noreferrer"
      >
        Si no ves cómo reserva encima de este texto, haz clic aquí para ir directamente al motor de reservas.
      </a>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()
const route = useRoute()
const { locale } = useI18n()

const computedLocale = computed(() => locale.value )

const bookingUrl = computed(() => {
  const base = 'https://direct-book.com/properties/hostalsoldirect?locale=' + computedLocale.value + '&promocode=WEB&currency=EUR&trackPage=no'
  const rateId = route.query.rateId as string | undefined
  if (!rateId) return base
  return `${base}&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&items[0][rateId]=${rateId}`
})

const rateId = computed(() => route.query.rateId as string | undefined)

useHead({
  title: computed(() => t('pages.reserva.title')),
  meta: [{ name: 'description', content: computed(() => t('pages.reserva.description')) as any }],
})

const features  = computed(() =>
  (tm('pages.reserva.features') as any[]).map((f: any) => rt(f)) as string[]
)
const featIcons = ['zap', 'shield-check', 'lock', 'x-circle']

const iframeEl = ref<HTMLIFrameElement | null>(null)

function onLoad() {
  try {
    const doc = iframeEl.value?.contentDocument || iframeEl.value?.contentWindow?.document
    if (doc && iframeEl.value) iframeEl.value.style.height = doc.body.scrollHeight + 'px'
  } catch { /* cross-origin */ }
}

onMounted(() => {
  window.addEventListener('message', (e) => {
    if (!iframeEl.value) return
    if (typeof e.data === 'object' && e.data?.type === 'resize') {
      iframeEl.value.style.height = e.data.height + 'px'
    } else if (typeof e.data === 'number') {
      iframeEl.value.style.height = e.data + 'px'
    }
  })
})
</script>

<style scoped>
.page-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 92px 0 80px;
  /* padding: 92px max(24px, 5vw) 80px; */
}

.title__block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.page-sub-heading, .page-heading, .discount-banner {
  margin: 0 max(24px, 5vw);
}
.page-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 20px;
}

.discount-banner {
  background: var(--green);
  color: #fff;
  border-radius: 12px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.discount-banner__text { flex: 1; }
.discount-banner__label { font-weight: 700; font-size: 16px; margin-bottom: 2px; }
.discount-banner__sub   { font-size: 13.5px; color: rgba(255,255,255,0.8); }
.discount-banner__badge {
  background: rgba(255,255,255,0.18);
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.04em;
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
  padding: 0 10px;
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

.iframe-wrap {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  border: 1px solid var(--border);
}
.booking-iframe {
  width: 100%;
  height: 720px;
  border: none;
  display: block;
}

.trouble-text {
  display: none;
  color: var(--dark-muted);
  font-size: 13px;
  margin-top: 14px;
  text-align: center;
}
.trouble-link { color: var(--green); font-weight: 700; margin-left: 4px; }

.link-to-reservation {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  
  margin-top: 18px;
  text-align: center;


  background: var(--green);
  color: white;
  font-weight: 700;
  padding: 10px;
  border-radius: 8px;
}
</style>
