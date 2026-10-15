<template>
  <section id="rooms" class="rooms section-padding pt-0">
    <div class="container">
      <UiSectionTag>{{ t('rooms.title') }}</UiSectionTag>
      <h2 class="rooms__heading">{{ t('rooms.sub') }}</h2>
      <p class="rooms__price">
        <LucideIcon name="tag" :size="15" color="var(--green)" />
        {{ t('common.priceFrom') }}
      </p>

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
      <!-- Compact gallery preview (full gallery lives on /galeria) -->
      <ul class="rooms__preview">
        <li v-for="photo in previewPhotos" :key="photo.path" class="rooms__preview-item">
          <NuxtLink
            :to="localePath({ name: 'galeria', query: { room: photo.room } })"
            class="rooms__preview-link"
            :aria-label="`${photo.alt} — ${t('rooms.galleryBtn')}`"
          >
            <NuxtImg
              :src="photo.path"
              :alt="photo.alt"
              class="rooms__preview-img"
              width="400"
              height="300"
              sizes="xs:50vw md:33vw lg:25vw xl:360px"
              densities="x1 x2"
              format="webp"
              loading="lazy"
              :modifiers="{ rotate: 0 }"
            />
            <span class="rooms__preview-caption">{{ photo.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!--  Button to go the the gallery -->
    <div class="container" style="text-align:center; margin-top: 20px;">
      <NuxtLink :to="localePath('galeria')" class="btn btn-secondary">
        {{ t('rooms.galleryBtn') }}
        <LucideIcon name="image" :size="14" color="var(--dark)" style="margin-left:6px" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RoomType } from '~/types'
import { AMENITY_ICONS, getExtraIcon, ROOM_TYPES, useRoomMediaAlts } from '~/composables/useRooms'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { roomPhotoPaths } = useRooms()
const { roomLabel, photoAlt } = useRoomMediaAlts()

// 8 representative photos: round-robin over room types (first photo of each
// room), skipping photos already used on the type cards. Deterministic → SSR-safe.
const PREVIEW_COUNT = 8
const previewPhotos = computed(() => {
  const cardPhotos = new Set(roomTypes.value.map(r => r.photoPath))
  const typeRooms = Object.values(ROOM_TYPES)
  const maxLen = Math.max(...typeRooms.map(r => r.length))
  const out: { path: string; room: string; alt: string; label: string }[] = []
  for (let i = 0; i < maxLen && out.length < PREVIEW_COUNT; i++) {
    for (const rooms of typeRooms) {
      const room = rooms[i]
      if (!room || out.length >= PREVIEW_COUNT) continue
      const path = roomPhotoPaths(room).find(p => !cardPhotos.has(p))
      if (path) out.push({ path, room, alt: photoAlt(path), label: roomLabel(room) })
    }
  }
  return out
})

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

<style>
/*
 * Preserve homepage look: these global rules used to reach the homepage via
 * RoomMediaGallery2's unscoped <style> block, which is no longer rendered here.
 * TODO: move to assets/css/main.css (or scope them) and drop this block.
 */
.carousel {
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}
img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  image-orientation: from-image;
}
</style>

<style scoped>
.rooms { background: #fff; }

.rooms__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: var(--dark);
  margin: 0 0 16px;
}

.rooms__price {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green-light);
  color: var(--dark);
  font-weight: 700;
  font-size: 14px;
  border-radius: 30px;
  padding: 8px 16px;
  margin: 0 0 28px;
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

/* Gallery preview */
.rooms__preview {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 8px 0 0;
  padding: 0;
}
@media (max-width: 860px) { .rooms__preview { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .rooms__preview { grid-template-columns: repeat(2, 1fr); gap: 8px; } }

.rooms__preview-link {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  background: var(--green-light);
}
.rooms__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  transition: transform 0.4s;
}
.rooms__preview-link:hover .rooms__preview-img,
.rooms__preview-link:focus-visible .rooms__preview-img { transform: scale(1.05); }
.rooms__preview-link:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

.rooms__preview-caption {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 18px 12px 8px;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
