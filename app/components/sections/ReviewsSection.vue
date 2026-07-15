<template>
  <section class="reviews section-padding-v">
    <!-- Header inside container -->
    <div class="container-sm reviews__header-wrap">
      <div class="reviews__header">
        <UiSectionTag>{{ t('reviews.title') }}</UiSectionTag>
        <h2 class="reviews__heading">{{ t('reviews.heading') }}</h2>
        <p class="reviews__sub">{{ t('reviews.sub') }}</p>
      </div>
    </div>

    <!-- Full-width carousel -->
    <ClientOnly>
      <Carousel
        v-model="currentSlide"
        :items-to-show="itemsToShow"
        :wrap-around="true"
        :autoplay="4500"
        :transition="600"
        snap-align="center"
        :pause-autoplay-on-hover="true"
        :mouse-drag="true"
        :touch-drag="true"
        class="reviews__carousel"
      >
        <Slide v-for="(rev, i) in items" :key="i">
          <div :class="['reviews__card', { 'reviews__card--active': i === currentSlide }]">
            <UiStarRating :count="rev.stars" />
            <p class="reviews__text">"{{ rev.text }}"</p>
            <div class="reviews__author">— {{ rev.name }}</div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </ClientOnly>

    <!-- Platform badges -->
    <div class="reviews__platforms">
      <a href="https://www.booking.com/hotel/es/hostal-sol-zamora.es.html" target="_blank" rel="noopener noreferrer" class="reviews__platform-badge reviews__platform-badge--booking">
        <NuxtPicture src="/images/icon/booking.svg" alt="" class="reviews__platform-logo" width="80" height="80" />
        <span class="reviews__platform-name">Booking.com</span>
      </a>
      <a href="https://www.expedia.es/Zamora-Hoteles-Hostal-Sol.h101083476.Informacion-Hotel" target="_blank" rel="noopener noreferrer" class="reviews__platform-badge reviews__platform-badge--expedia">
        <NuxtPicture src="/images/icon/expedia.png" alt="" class="reviews__platform-logo" width="80" height="80" />
        <span class="reviews__platform-name">Expedia</span>
      </a>
      <a href="https://www.spanish.hostelworld.com/pwa/hosteldetails.php/Hostal-Sol/Zamora/330134" target="_blank" rel="noopener noreferrer" class="reviews__platform-badge reviews__platform-badge--hostelworld">
        <NuxtPicture src="/images/icon/hostelworld.png" alt="" class="reviews__platform-logo" width="80" height="80" />
        <span class="reviews__platform-name">HostelWorld</span>
      </a>
    </div>

    <!-- CTA band -->
    <NuxtLink :to="localePath('reserva')" class="reviews__cta-band">
      <div class="reviews__cta-band-content">
        <LucideIcon name="tag" :size="18" color="#fff" />
        <span>{{ t('reviews.ctaBand') }}</span>
        <span class="reviews__cta-band-btn">{{ t('reviews.ctaBandBtn') }}</span>
      </div>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import type { Review } from '~/types'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const items = computed(() =>
  (tm('reviews.items') as any[]).map((rev: any) => ({
    name:  rt(rev.name),
    text:  rt(rev.text),
    stars: Number(rev.stars),
  })) as Review[]
)

const currentSlide = ref(0)

const itemsToShow = computed(() => {
  if (import.meta.client) {
    return window.innerWidth >= 1024 ? 2.2 : window.innerWidth >= 640 ? 1.6 : 1.1
  }
  return 1.1
})
</script>

<style scoped>
.reviews { background: var(--cream); padding-bottom: 0; }

.reviews__header-wrap {
  padding: 0 max(24px, 6vw);
  margin-bottom: 32px;
}

.reviews__header { margin-bottom: 20px; }

.reviews__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: var(--dark);
  margin: 0 0 8px;
}
.reviews__sub { color: var(--dark-muted); margin: 0; }

/* Platform badges */
.reviews__platforms {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 32px 0 0;
  padding: 0 max(24px, 6vw);
}

.reviews__platform-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.2s, opacity 0.2s;
}
.reviews__platform-badge:hover { transform: scale(1.06); opacity: 0.9; }

.reviews__platform-logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: block;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.reviews__platform-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--dark-muted);
  letter-spacing: 0.02em;
}

.reviews__platform-badge--booking,
.reviews__platform-badge--expedia,
.reviews__platform-badge--hostelworld { background: none; }

/* Carousel */
.reviews__carousel {
  width: 100%;
  padding: 0 0 20px;
}

.reviews__card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1.5px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
  margin: 4px 10px;
  text-align: left;
  width: calc(100% - 20px);
  cursor: grab;
}

.reviews__card--active {
  border-color: var(--green);
  box-shadow: 0 6px 24px rgba(104,126,86,0.15);
}

.reviews__text {
  color: var(--dark);
  font-size: 14.5px;
  line-height: 1.75;
  margin: 12px 0 16px;
  font-style: italic;
}
.reviews__author { font-weight: 700; font-size: 13px; color: var(--green); }

/* Carousel overrides */
:deep(.carousel__pagination) { margin-top: 16px; }
:deep(.carousel__pagination-button) {
  position: relative;
  width: 8px; height: 8px;
  border-radius: 4px;
  background: var(--border);
  padding: 0;
  transition: width 0.3s, background 0.3s;
}
:deep(.carousel__pagination-button::before) {
  content: '';
  position: absolute;
  top: -20px; left: -20px; right: -20px; bottom: -20px;
}
:deep(.carousel__pagination-button--active) {
  width: 24px;
  background: var(--green);
}
:deep(.carousel__prev),
:deep(.carousel__next) {
  background: #fff;
  border-radius: 50%;
  width: 48px; height: 48px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: var(--dark);
}

/* CTA Band */
.reviews__cta-band {
  display: block;
  width: 100%;
  text-decoration: none;
  background: linear-gradient(270deg, #3a6b2a, #5a8f4a, #3a6b2a, #2d5220);
  background-size: 400% 400%;
  animation: ctaBandShift 8s ease infinite;
  margin-top: 40px;
  padding: 28px max(24px, 6vw);
  transition: opacity 0.2s;
}
.reviews__cta-band:hover { opacity: 0.92; }

@keyframes ctaBandShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.reviews__cta-band-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.reviews__cta-band-content > span:first-of-type {
  color: rgba(255,255,255,0.92);
  font-size: 15px;
  font-weight: 500;
  flex: 1;
  min-width: 200px;
}

.reviews__cta-band-btn {
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.5);
  color: #fff !important;
  border-radius: 8px;
  padding: 10px 22px;
  margin: auto;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
