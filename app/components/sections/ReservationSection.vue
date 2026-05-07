<template>
  <section id="reserve" class="reserve section-padding">
    <div class="container-sm">
      <UiSectionTag>{{ t('reserve.title') }}</UiSectionTag>
      <h2 class="reserve__heading">{{ t('reserve.sub') }}</h2>

      <!-- 3D spinning discount card -->
      <div class="reserve__discount-scene" ref="cardScene">
        <div class="reserve__discount-card" ref="card">
          <div class="reserve__discount-num">{{ t('reserve.discountNum') }}</div>
          <div class="reserve__discount-label">{{ t('reserve.discountLabel') }}</div>
          <div class="reserve__discount-note">{{ t('reserve.discountNote') }}</div>
        </div>
      </div>

      <!-- Feature chips -->
      <div class="reserve__features">
        <div v-for="(feat, i) in features" :key="i" class="chip">
          <LucideIcon :name="featIcons[i] ?? 'star'" :size="14" color="var(--green)" />
          {{ feat }}
        </div>
      </div>

      <!-- Booking engine iframe -->
      <div class="reserve__iframe-wrap">
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
      </div>

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

const cardScene = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)

function onMouseMove(e: MouseEvent) {
  if (!card.value || !cardScene.value) return
  const rect = cardScene.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.value.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`
}

function onMouseLeave() {
  if (!card.value) return
  card.value.style.transform = ''
}

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
  cardScene.value?.addEventListener('mousemove', onMouseMove)
  cardScene.value?.addEventListener('mouseleave', onMouseLeave)
  onUnmounted(() => {
    cardScene.value?.removeEventListener('mousemove', onMouseMove)
    cardScene.value?.removeEventListener('mouseleave', onMouseLeave)
  })

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

/* 3D discount card */
.reserve__discount-scene {
  perspective: 800px;
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
  user-select: none;
}

.reserve__discount-card {
  background: var(--green);
  color: #fff;
  border-radius: 18px;
  padding: 28px 48px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(104,126,86,0.35);
  animation: cardFloat 6s ease-in-out infinite;
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
}

@keyframes cardFloat {
  0%, 100% { transform: rotateY(-8deg) rotateX(3deg) translateY(0px); }
  33%       { transform: rotateY(6deg) rotateX(-2deg) translateY(-6px); }
  66%       { transform: rotateY(-3deg) rotateX(4deg) translateY(3px); }
}

.reserve__discount-num {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
}
.reserve__discount-label {
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.reserve__discount-note {
  font-size: 13px;
  color: rgba(255,255,255,0.78);
  margin-top: 6px;
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
</style>
