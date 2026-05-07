<template>
  <section class="about section-padding">
    <div class="container grid-2">
      <!-- Left: text -->
      <div>
        <UiSectionTag>Hostal Sol Zamora</UiSectionTag>
        <h2 class="about__title">{{ t('about.title') }}</h2>
        <p class="about__body">{{ t('about.body') }}</p>

        <Transition name="expand">
          <div v-if="expanded" class="about__history">
            <p>{{ t('about.history1') }}</p>
            <p>{{ t('about.history2') }}</p>
            <p>{{ t('about.history3') }}</p>
          </div>
        </Transition>

        <button class="about__toggle" @click="expanded = !expanded">
          <LucideIcon :name="expanded ? 'chevron-up' : 'chevron-down'" :size="15" color="var(--green)" />
          {{ expanded ? t('about.showLess') : t('about.showMore') }}
        </button>

        <p class="about__since">{{ t('about.since') }}</p>
      </div>

      <!-- Right: chips + photo -->
      <div class="about__right">
        <div class="about__chips">
          <div v-for="chip in chips" :key="chip.key" class="about__chip">
            <LucideIcon :name="chip.icon" :size="22" color="var(--green)" />
            <span>{{ t(`about.chips.${chip.key}`) }}</span>
          </div>
        </div>
        <div class="about__img-wrap">
          <img :src="ABOUT_IMG" alt="Hostal Sol Zamora" class="about__img" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_IMG } from '~/composables/useRooms'

const { t } = useI18n()
const expanded = ref(false)

const chips = [
  { key: 'location', icon: 'map-pin' },
  { key: 'bathroom', icon: 'shower-head' },
  { key: 'pets',     icon: 'paw-print' },
  { key: 'rating',   icon: 'star' },
]
</script>

<style scoped>
.about { background: var(--green-light); }

.about__title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  color: var(--dark);
  margin: 0 0 20px;
}

.about__body {
  color: #5a5a50;
  line-height: 1.8;
  font-size: 15.5px;
  margin-bottom: 20px;
}

.about__history {
  color: #5a5a50;
  line-height: 1.8;
  font-size: 15.5px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about__toggle {
  background: none;
  border: 1.5px solid var(--green);
  border-radius: 8px;
  padding: 9px 20px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.about__toggle:hover { background: rgba(104,126,86,0.08); }

.about__since {
  color: var(--green);
  font-weight: 600;
  font-size: 13.5px;
  letter-spacing: 0.04em;
}

.about__right { display: flex; flex-direction: column; gap: 14px; }

.about__chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.about__chip {
  background: #fff;
  border-radius: 12px;
  padding: 18px 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--dark);
}

.about__img-wrap {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
}
.about__img { width: 100%; height: 100%; object-fit: cover; }

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: opacity 0.3s, max-height 0.4s ease;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
