<template>
  <section id="hero" class="hero">
    <!-- Slideshow -->
    <div
      v-for="(src, i) in HERO_PHOTOS"
      :key="i"
      class="hero__slide"
      :style="{ backgroundImage: `url(${src})`, opacity: i === currentIdx ? 1 : 0 }"
      aria-hidden="true"
    />

    <!-- Overlay -->
    <div class="hero__overlay" />

    <!-- Discount banner -->
    <div class="hero__banner-wrap">
      <NuxtLink to="/reserva" class="hero__banner">
        <LucideIcon name="tag" :size="13" color="#fff" />
        {{ t('hero.discount') }}
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="hero__content">
      <img
        :src="LOGO_SVG"
        alt="Hostal Sol Zamora"
        class="hero__logo"
        @error="(e) => { (e.target as HTMLImageElement).src = LOGO_ICON }"
      />
      <p class="hero__sub">{{ t('hero.sub') }}</p>
      <div class="hero__ctas">
        <button class="hero__cta-primary" @click="scrollTo('reserve')">
          {{ t('hero.cta') }}
        </button>
        <button class="hero__cta-secondary" @click="scrollTo('rooms')">
          {{ t('hero.ctaRooms') }}
        </button>
      </div>

      <!-- Features carousel -->
      <div class="hero__features-wrap">
        <ClientOnly>
          <Carousel
            :items-to-show="'auto'"
            :wrap-around="true"
            :autoplay="6000"
            :transition="700"
            :pause-autoplay-on-hover="true"
            :mouse-drag="true"
            :touch-drag="true"
            class="hero__features-carousel"
          >
            <Slide v-for="(feat, i) in features" :key="i">
              <a
                v-if="feat.link"
                :href="feat.link"
                target="_blank"
                rel="noopener noreferrer"
                class="hero__feat-card"
              >
                <LucideIcon :name="feat.icon" :size="18" color="#fff" />
                <span>{{ feat.label }}</span>
              </a>
              <div v-else class="hero__feat-card">
                <LucideIcon :name="feat.icon" :size="22" color="#fff" />
                <span>{{ feat.label }}</span>
              </div>
            </Slide>
          </Carousel>
        </ClientOnly>
      </div>
    </div>

    <!-- Dot pagination -->
    <div class="hero__dots">
      <button
        v-for="(_, i) in HERO_PHOTOS"
        :key="i"
        :class="['hero__dot', { 'hero__dot--active': i === currentIdx }]"
        :aria-label="`Foto ${i + 1}`"
        @click="currentIdx = i"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { SHUFFLED_HERO_PHOTOS, LOGO_SVG, LOGO_ICON } from '~/composables/useRooms'
import { Carousel, Slide } from 'vue3-carousel'

const HERO_PHOTOS = SHUFFLED_HERO_PHOTOS;

const { t, tm, rt } = useI18n()
const { scrollTo } = useScrollTo()

const currentIdx = ref(0)

const featItemsToShow = computed(() => {
  if (import.meta.client) {
    return window.innerWidth >= 1024 ? 4.5 : window.innerWidth >= 640 ? 3 : 2.2
  }
  return 3
})

const features = computed(() =>
  (tm('hero.features') as any[]).map((f: any) => ({
    icon:  rt(f.icon),
    label: rt(f.label),
    link:  f.link ?? null,
  }))
)

onMounted(() => {
  const timer = setInterval(() => {
    currentIdx.value = (currentIdx.value + 1) % HERO_PHOTOS.length
  }, 5000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 580px;
  overflow: hidden;
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: opacity 1.2s ease;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(25,25,15,0.65) 0%, rgba(50,55,35,0.35) 100%);
}

.hero__banner-wrap {
  position: absolute;
  top: 76px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 5;
  height: auto;
}

.hero__banner {
  background: var(--green);
  color: #fff;
  font-size: 13px;
  padding: 7px 22px;
  border-radius: 30px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.hero__banner:hover { opacity: 0.9; }

.hero__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.hero__logo {
  height: clamp(52px, 8vw, 110px);
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
  margin-bottom: 20px;
  max-width: 480px;
}

.hero__sub {
  color: rgba(255,255,255,0.85);
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-bottom: 32px;
  
  text-shadow: 0 1px 8px rgba(0,0,0,0.35);
}

.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 36px; }

.hero__cta-primary {
  background: var(--green);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 36px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 20px rgba(104,126,86,0.5);
  transition: opacity 0.2s;
}
.hero__cta-primary:hover { opacity: 0.85; }

.hero__cta-secondary {
  background: rgba(255,255,255,0.14);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.45);
  border-radius: 10px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}
.hero__cta-secondary:hover { background: rgba(255,255,255,0.22); }

/* Features */
.hero__features-wrap {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.hero__features-carousel {
  width: 100%;
}

.hero__features-wrap :deep(.carousel__slide) {
  padding: 0 5px;
}

.hero__feat-card {
  display: flex;
  flex-direction: column;
  
  align-items: center;
  width: 100%;
  max-width: 12rem;
  min-width: 10rem;
  height: 100%;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 10px;
  padding: 14px 22px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
    overflow: hidden;

  & span {
    text-align: center;
    overflow: hidden;
  }
}
.hero__feat-card:hover { background: rgba(255,255,255,0.2); }

/* Dot pagination */
.hero__dots {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.3s, background 0.3s;
}
.hero__dot--active { width: 24px; background: #fff; }

/* Mobile: center logo and content */
@media (max-width: 640px) {
  .hero__content {
    align-items: center;
    text-align: center;
    padding: 0;
  }
  .hero__logo { margin-left: auto; margin-right: auto; }
  .hero__sub { text-align: center; }
  .hero__ctas { justify-content: center; }
  .hero__features-wrap { max-width: 100%; }
}
</style>
