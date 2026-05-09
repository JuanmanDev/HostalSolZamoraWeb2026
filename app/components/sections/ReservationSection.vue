<template>
  <section id="reserve" class="reserve section-padding">
    <div class="container-sm">
      <UiSectionTag>{{ t('reserve.title') }}</UiSectionTag>
      <h2 class="reserve__heading">{{ t('reserve.sub') }}</h2>

      <SectionsDiscountCard3d>
        <template #num><div class="reserve__discount-num">{{ t('reserve.discountNum') }}</div></template>
        <template #label><div class="reserve__discount-label">{{ t('reserve.discountLabel') }}</div></template>
        <template #note><div class="reserve__discount-note">{{ t('reserve.discountNote') }}</div></template>
      </SectionsDiscountCard3d>

      <!-- Feature chips -->
      <div class="reserve__features">
        <div v-for="(feat, i) in features" :key="i" class="chip">
          <LucideIcon :name="featIcons[i] ?? 'star'" :size="14" color="var(--green)" />
          {{ feat }}
        </div>
      </div>

      <!-- Big button to start reservation -->
      <div class="reserve__cta-main">
        <NuxtLink to="/reserva" class="btn btn--primary">
          {{ t('nav.reserve') }}
        </NuxtLink>
      </div>

      <!-- Booking engine iframe -->
      <!-- <div class="reserve__iframe-wrap">
        <iframe
          ref="iframeEl"
          src="https://direct-book.com/properties/hostalsoldirect?locale=es&promocode=WEB"
          class="reserve__iframe"
          title="Motor de reservas — Hostal Sol Zamora"
          frameborder="0"
          scrolling="no"
          allow="payment"
          @load="onIframeLoad"
        />
      </div> -->

      <p class="reserve__help">
        {{ t('reserve.helpText') }}
        <NuxtLink to="/reserva" class="reserve__help-link">{{ t('reserve.helpLink') }}</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()

const features = computed(() =>
  (tm('reserve.features') as any[]).map((f: any) => rt(f)) as string[]
)

const featIcons = ['shield-check', 'x-circle', 'lock', 'zap']

const iframeEl = ref<HTMLIFrameElement | null>(null)

function onIframeLoad() {
  try {
    const iframe = iframeEl.value
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      iframe.style.height = doc.body.scrollHeight + 'px'
    }
  } catch {
    // cross-origin — leave at default height
  }
}

onMounted(() => {
  window.addEventListener('message', (e) => {
    if (typeof e.data === 'object' && e.data?.type === 'resize' && iframeEl.value) {
      iframeEl.value.style.height = e.data.height + 'px'
    }
    if (typeof e.data === 'number' && iframeEl.value) {
      iframeEl.value.style.height = e.data + 'px'
    }
  })
})
</script>

<style scoped>
.reserve { background: #fff; }

.reserve__heading {
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  color: var(--dark);
  margin: 0 0 32px;
  text-align: center;
}

/* Features */
.reserve__features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
}

/* iframe */
.reserve__iframe-wrap {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 20px;
  min-height: 400px;
}

.reserve__iframe {
  width: 100%;
  min-height: 400px;
  height: 600px;
  border: none;
  display: block;
  transition: height 0.3s;
}

/* Help */
.reserve__help {
  color: var(--dark-muted);
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
}
.reserve__help-link {
  color: var(--green);
  font-weight: 600;
  margin-left: 4px;
}

.reserve__cta-main {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.reserve__cta-main a {
  background-color: var(--green);
  border-radius: 1rem;
  font-size: 20px;
  color: #fff;
}

</style>
