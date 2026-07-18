<template>
  <section class="rec">
    <!-- Background slideshow using local photos -->
    <div
      v-for="(photo, i) in RESTAURANT_PHOTOS"
      :key="i"
      class="rec__bg-slide"
      :style="{ opacity: i === slideIdx ? 1 : 0 }"
    >
      <NuxtPicture
        :src="photo"
        width="1920"
        height="1080"
        format="webp"
        class="rec__bg-img"
        alt=""
        :img-attrs="{ style: 'width: 100%; height: 100%; object-fit: cover;' }"
        loading="lazy"
      />
    </div>

    <!-- Gradient overlay -->
    <div class="rec__overlay" />

    <!-- Content -->
    <div class="rec__content container-md">
      <div class="rec__text-backdrop">
        <UiSectionTag light>{{ t('restaurant.tag') }}</UiSectionTag>
        <h2 class="rec__title">{{ t('restaurant.title') }}</h2>

        <!-- Rating -->
        <div class="rec__rating">
          <LucideIcon name="star" :size="16" color="#f5c518" style="fill:#f5c518" />
          <strong class="rec__rating-num">{{ t('restaurant.rating') }}</strong>
          <span class="rec__rating-label">{{ t('restaurant.ratingLabel') }}</span>
        </div>

        <p class="rec__body">{{ t('restaurant.body1') }}</p>
        <p class="rec__body rec__body--last">{{ t('restaurant.body2') }}</p>
        <div class="rec__actions">
          <a
            href="https://www.google.com/maps/search/Restaurante+Padornelo+Zamora"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost"
          >
            <LucideIcon name="map-pin" :size="15" color="#fff" />
            {{ t('restaurant.mapsBtn') }}
          </a>
          <span class="rec__distance">
            <LucideIcon name="footprints" :size="14" color="rgba(255,255,255,0.7)" />
            {{ t('restaurant.distance') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="rec__dots">
      <button
        v-for="(_, i) in RESTAURANT_PHOTOS"
        :key="i"
        :class="['rec__dot', { 'rec__dot--active': i === slideIdx }]"
        :aria-label="`Foto ${i + 1}`"
        @click="slideIdx = i"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RESTAURANT_PHOTOS } from '~/composables/useRooms'

const { t } = useI18n()

const slideIdx = ref(0)

onMounted(() => {
  const timer = setInterval(() => {
    slideIdx.value = (slideIdx.value + 1) % RESTAURANT_PHOTOS.length
  }, 5500)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.rec {
  position: relative;
  min-height: 600px;
  overflow: hidden;
  background: var(--dark);
}

.rec__bg-slide {
  position: absolute;
  inset: 0;
  transition: opacity 1.4s ease;
}

.rec__bg-img {
  width: 100%;
  height: 100%;
}
.rec__bg-img :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rec__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(0,0,0,0.82) 0%,
    rgba(0,0,0,0.55) 45%,
    rgba(0,0,0,0.18) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.rec__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  max-width: 640px;
  z-index: 2;
}

.rec__text-backdrop {
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 14px;
  padding: 28px 32px;
}

.rec__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.1;
}

.rec__rating {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 18px;
}
.rec__rating-num {
  color: #fff;
  font-size: 18px;
  font-weight: 800;
}
.rec__rating-label {
  color: rgba(255,255,255,0.55);
  font-size: 13px;
}

.rec__body {
  color: rgba(255,255,255,0.78);
  line-height: 1.8;
  font-size: 15px;
  margin-bottom: 10px;
}
.rec__body--last { margin-bottom: 24px; }

.rec__actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.rec__distance {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.65);
  font-size: 13.5px;
}

.rec__dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.rec__dot {
  width: 48px;
  height: 48px;
  padding: 20px;
  background-color: transparent;
  background-clip: content-box;
  border: 1.5px solid rgba(255,255,255,0.5);
  border-radius: 24px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
  margin: -16px;
}
.rec__dot--active { width: 64px; background-color: #fff; border-color: transparent; }

</style>
