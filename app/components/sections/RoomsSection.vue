<template>
  <section id="rooms" class="rooms section-padding pt-0">
    <div class="container">
      <UiSectionTag>{{ t('rooms.title') }}</UiSectionTag>
      <h2 class="rooms__heading">{{ t('rooms.sub') }}</h2>

      
      <div class="rooms__amenities">
        <span v-for="a in [...amenities]" :key="a" class="rooms__chip">
          <LucideIcon :name="amenityIcon(a)" :size="12" color="var(--green)" />
          {{ a }}
        </span>
      </div>

      <!-- Room type cards -->
      <div class="rooms__types">
        <div v-for="type in roomTypes" :key="type.label" class="rooms__type-card">
          <div class="rooms__type-img-wrap">
            <img :src="type.photoPath" :alt="type.label" loading="lazy" class="rooms__type-img" />
          </div>
          <div class="rooms__type-body">
            <div class="rooms__type-name">
              <LucideIcon :name="type.icon" :size="18" color="var(--green)" />
              {{ type.label }}
            </div>
            <div class="rooms__amenities">
              <span v-for="a in [ ...type.extras]" :key="a" class="rooms__chip">
                <LucideIcon :name="amenityIcon(a)" :size="12" color="var(--green)" />
                {{ a }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reserve CTA after room cards -->
      <div class="rooms__reserve-row">
        <NuxtLink to="/reserva" class="btn btn-primary rooms__reserve-btn">
          <LucideIcon name="calendar-check" :size="16" color="#fff" />
          {{ t('rooms.reserveBtn') }}
        </NuxtLink>
      </div>
    </div>

  </section>
    <!-- Room Media Gallery -->
    <SectionsRoomMediaGallery2
      hideThumbailsAll="false"
    />
</template>

<script setup lang="ts">
import type { RoomType } from '~/types'

const { t, tm, rt } = useI18n()

const roomTypes = computed(() =>
  (tm('rooms.types') as any[]).map((type: any) => ({
    label:     rt(type.label),
    icon:      rt(type.icon),
    photoPath: rt(type.photoPath),
    extras:    (type.extras as any[]).map((e: any) => rt(e)),
  })) as RoomType[]
)

const amenities = computed(() =>
  (tm('rooms.amenities') as any[]).map((a: any) => rt(a)) as string[]
)

const AMENITY_ICONS: Record<string, string> = {
  'TV': 'tv',
  'WiFi': 'wifi',
  'Wifi': 'wifi',
  'Baño privado': 'shower-head',
  'Private bathroom': 'shower-head',
  'Escritorio': 'armchair',
  'Desk': 'armchair',
  'Calefacción central': 'thermometer',
  'Central heating': 'thermometer',
  'Aire acondicionado': 'wind',
  'Air conditioning': 'wind',
  'Amenities': 'package',
  'Toallas y ropa de cama': 'bed',
  'Towels & bed linen': 'bed',
  'Balcón privado': 'trees',
  'Private balcony': 'trees',
}

function amenityIcon(name: string): string {
  return AMENITY_ICONS[name] ?? 'check'
}
</script>

<style scoped>
.rooms { background: #fff; }

.rooms__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: var(--dark);
  margin: 0 0 36px;
}

/* Type cards */
.rooms__types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
}
@media (max-width: 860px) { .rooms__types { grid-template-columns: 1fr; } }

.rooms__type-card { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
.rooms__type-img-wrap { height: 200px; overflow: hidden; }
.rooms__type-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.rooms__type-img:hover { transform: scale(1.05); }
.rooms__type-body { padding: 18px 20px; background: var(--cream); }
.rooms__type-name {
  font-weight: 700; font-size: 16px; color: var(--dark);
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
.rooms__amenities { display: flex; flex-wrap: wrap; gap: 6px; }
.rooms__chip { background: var(--green-light); border-radius: 20px; padding: 4px 11px; font-size: 12.5px; color: var(--dark-muted); }

/* Reserve row */
.rooms__reserve-row {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}
.rooms__reserve-btn { padding: 12px 36px; font-size: 15px; }


.rooms.section-padding {
  padding-bottom: 8px;
}
</style>
