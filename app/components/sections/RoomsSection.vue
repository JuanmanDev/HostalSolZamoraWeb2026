<template>
  <section id="rooms" class="rooms section-padding pt-0">
    <div class="container">
      <UiSectionTag>{{ t('rooms.title') }}</UiSectionTag>
      <h2 class="rooms__heading">{{ t('rooms.sub') }}</h2>

      <SectionsRoomAmenityChips :items="amenities" />

      <!-- Room type cards -->
      <div class="rooms__types">
        <div v-for="type in roomTypes" :key="type.label" class="rooms__type-card">
          <div class="rooms__type-img-wrap">
            <NuxtPicture :src="type.photoPath" :alt="type.label" class="rooms__type-img" width="600" height="400" />
          </div>
          <div class="rooms__type-body">
            <div class="rooms__type-name">
              <LucideIcon :name="type.icon" :size="18" color="var(--green)" />
              {{ type.label }}
            </div>
            <SectionsRoomAmenityChips :items="type.extras" />
            <NuxtLink
              :to="localePath({ name: 'reserva', query: { rateId: type.rateId } })"
              class="btn btn-primary rooms__reserve-card-btn"
            >
              <LucideIcon name="calendar-check" :size="14" color="#fff" />
              {{ t('rooms.reserveBtn') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Reserve CTA after room cards -->
      <!-- <div class="rooms__reserve-row">
        <NuxtLink to="/reserva" class="btn btn-primary rooms__reserve-btn">
          <LucideIcon name="calendar-check" :size="16" color="#fff" />
          {{ t('rooms.reserveBtn') }}
        </NuxtLink>
      </div> -->
    </div>
    <!-- Room Media Gallery -->
    <SectionsRoomMediaGallery2
      hideThumbailsAll="false"
    />

  </section>

  <!--  Button to go the the gallery -->
  <div class="container" style="text-align:center; margin-top: 20px;">
    <NuxtLink :to="localePath('galeria')" class="btn btn-secondary">
      {{ t('rooms.galleryBtn') }}
      <LucideIcon name="image" :size="14" color="var(--dark)" style="margin-left:6px" />
    </NuxtLink>
   </div>
</template>

<script setup lang="ts">
import type { RoomType } from '~/types'
import { AMENITY_ICONS, getExtraIcon } from '~/composables/useRooms'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const roomTypes = computed(() =>
  (tm('rooms.types') as any[]).map((type: any) => ({
    label:     rt(type.label),
    icon:      rt(type.icon),
    photoPath: rt(type.photoPath),
    extras:    (type.extras as any[]).map((e: any) => ({
      label: rt(e),
      icon: getExtraIcon(rt(e))
    })),
    rateId:    rt(type.rateId),
  })) as any[]
)

const amenities = computed(() =>
  (tm('rooms.amenities') as any[]).map((a: any, i: number) => ({
    label: rt(a),
    icon: AMENITY_ICONS[i] || 'check'
  }))
)

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

.rooms__type-card { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
}
.rooms__type-img-wrap { height: 200px; overflow: hidden; }
.rooms__type-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.rooms__type-img:hover { transform: scale(1.05); }
.rooms__type-body { padding: 18px 20px; background: var(--cream); flex-grow: 1; 
  display: flex; flex-direction: column;
  justify-content: space-between;
}
.rooms__type-name {
  font-weight: 700; font-size: 16px; color: var(--dark);
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
/* Reserve row */
.rooms__reserve-row {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}
.rooms__reserve-btn { padding: 12px 36px; font-size: 15px; }

.rooms__reserve-card-btn {
  margin-top: 14px;
  padding: 8px 20px;
  font-size: 13px;
  width: 100%;
  justify-content: center;
}

.rooms.section-padding {
  padding-bottom: 8px;
}

.btn.btn-secondary {
  background: rgba(0,0,0,0.05);
  color: var(--dark);
  border: none;
  border-radius: 10px;
  padding: 12px 36px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  margin-bottom: 8px;
}
</style>
