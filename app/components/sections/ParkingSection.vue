<template>
  <section id="parking" class="parking section-padding">
    <div class="container">
      <UiSectionTag>{{ t('parking.sub') }}</UiSectionTag>
      <div class="parking__header">
        <h2 class="parking__heading">{{ t('parking.title') }}</h2>
        <NuxtLink to="/parking" class="btn btn-primary">{{ t('parking.fullGuide') }}</NuxtLink>
      </div>

      <div class="parking__grid">
        <div v-for="(opt, i) in options" :key="i" class="parking__card">
          <div class="parking__card-top">
            <LucideIcon name="parking-square" :size="24" color="var(--green)" />
            <span class="parking__price">{{ opt.price }}</span>
          </div>
          <div class="parking__name">{{ opt.name }}</div>
          <div class="parking__dist">
            <LucideIcon name="map-pin" :size="12" color="var(--green)" />
            {{ opt.dist }}
          </div>
          <p class="parking__tip">{{ opt.tip }}</p>
          <a :href="opt.link" target="_blank" rel="noopener noreferrer" class="parking__nav-btn">
            <LucideIcon name="navigation" :size="13" color="var(--green)" />
            {{ t('parking.nav') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ParkingOption } from '~/types'

const { t, tm, rt } = useI18n()
const options = computed(() =>
  (tm('parking.options') as any[]).map((opt: any) => ({
    name:  rt(opt.name),
    dist:  rt(opt.dist),
    price: rt(opt.price),
    tip:   rt(opt.tip),
    link:  rt(opt.link),
  })) as ParkingOption[]
)
</script>

<style scoped>
.parking { background: var(--green-light); }

.parking__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.parking__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: var(--dark);
  margin: 0;
}

.parking__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.parking__card {
  background: #fff;
  border-radius: 14px;
  padding: 22px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.parking__card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.parking__price {
  background: var(--green);
  color: #fff;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
}

.parking__name { font-weight: 700; font-size: 15px; color: var(--dark); }

.parking__dist {
  color: var(--green);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  gap: 5px;
  align-items: center;
}

.parking__tip {
  color: var(--dark-muted);
  font-size: 13.5px;
  line-height: 1.6;
  flex: 1;
}

.parking__nav-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: var(--green-light);
  color: var(--green);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: background 0.2s;
}
.parking__nav-btn:hover { background: #d8e0d0; }

@media (max-width: 860px) {
  .parking__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .parking__grid { grid-template-columns: 1fr; }
}
</style>
