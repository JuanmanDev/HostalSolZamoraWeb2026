<template>
  <section id="rooms" class="rooms section-padding">
    <div class="container">
      <UiSectionTag>{{ t('rooms.title') }}</UiSectionTag>
      <h2 class="rooms__heading">{{ t('rooms.sub') }}</h2>

      <!-- Room type cards -->
      <div class="rooms__types">
        <div v-for="type in roomTypes" :key="type.label" class="rooms__type-card">
          <div class="rooms__type-img-wrap">
            <img :src="photoUrl(type.photoId)" :alt="type.label" loading="lazy" class="rooms__type-img" />
          </div>
          <div class="rooms__type-body">
            <div class="rooms__type-name">
              <LucideIcon :name="type.icon" :size="18" color="var(--green)" />
              {{ type.label }}
            </div>
            <div class="rooms__amenities">
              <span v-for="a in [...amenities, ...type.extras]" :key="a" class="rooms__chip">
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

      <!-- Filter bar -->
      <div class="rooms__filters">
        <div class="rooms__media-toggle">
          <button
            v-for="m in mediaFilters"
            :key="m.key"
            :class="['rooms__media-btn', { 'rooms__media-btn--active': mediaFilter === m.key }]"
            @click="onMediaChange(m.key)"
          >
            <LucideIcon :name="m.icon" :size="13" />
            {{ t(`rooms.${m.labelKey}`) }}
          </button>
        </div>

        <!-- Room tabs: horizontal scroll on desktop, <select> on mobile -->
        <div class="rooms__room-tabs rooms__room-tabs--desktop">
          <button
            :class="['rooms__tab', { 'rooms__tab--active': activeRoom === 'All' }]"
            @click="onRoomChange('All')"
          >
            {{ t('rooms.filterAll') }}
          </button>
          <button
            v-for="key in roomKeys"
            :key="key"
            :class="['rooms__tab', { 'rooms__tab--active': activeRoom === key }]"
            @click="onRoomChange(key)"
          >
            {{ key === 'Entrada' ? t('rooms.entrance') : key }}
          </button>
        </div>

        <select class="rooms__room-select rooms__room-tabs--mobile" :value="activeRoom" @change="onRoomChange(($event.target as HTMLSelectElement).value)">
          <option value="All">{{ t('rooms.filterAll') }}</option>
          <option v-for="key in roomKeys" :key="key" :value="key">
            {{ key === 'Entrada' ? t('rooms.entrance') : key }}
          </option>
        </select>
      </div>
    </div>

    <!-- Full-width carousel (no side padding) -->
    <ClientOnly>
      <div v-if="mediaItems.length > 0" class="rooms__gallery">
        <Carousel
          ref="mainCarouselRef"
          v-model="currentSlide"
          :wrap-around="true"
          :autoplay="4500"
          :transition="600"
          :items-to-show="1.06"
          snap-align="center"
          :pause-autoplay-on-hover="true"
          :mouse-drag="true"
          :touch-drag="true"
          @slide-end="onSlideEnd"
        >
          <Slide v-for="(item, i) in mediaItems" :key="`${item.type}-${i}`">
            <div class="rooms__slide" @click="handleSlideClick(i, item)">
              <img
                v-if="item.type === 'photo'"
                :src="photoUrl(item.id!)"
                :alt="`Habitación ${activeRoom}`"
                :loading="i === 0 ? 'eager' : 'lazy'"
                class="rooms__slide-img"
              />
              <div
                v-else
                class="rooms__slide-video"
                :style="{ backgroundImage: `url(${photoUrl(roomPhotoIds(item.room!)[0] ?? 301)})` }"
              >
                <div class="rooms__play-btn">
                  <LucideIcon name="play" :size="36" color="#fff" />
                </div>
                <span class="rooms__video-lbl">{{ t('rooms.videoLabel') }} {{ item.room }}</span>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>

        <!-- Thumbnails with arrows and drag scroll -->
        <div class="rooms__thumbs-wrap">
          <button class="rooms__thumbs-arrow rooms__thumbs-arrow--left" @click="scrollThumbs(-1)" aria-label="Anterior">
            <LucideIcon name="chevron-left" :size="16" color="var(--dark)" />
          </button>

          <div
            ref="thumbsRef"
            class="rooms__thumbs"
            @mousedown="onThumbDragStart"
            @mousemove="onThumbDragMove"
            @mouseup="onThumbDragEnd"
            @mouseleave="onThumbDragEnd"
          >
            <button
              v-for="(item, i) in mediaItems"
              :key="i"
              :class="['rooms__thumb', { 'rooms__thumb--active': i === currentSlide }]"
              @click="goToSlide(i)"
            >
              <img
                :src="photoUrl(item.type === 'photo' ? item.id! : (roomPhotoIds(item.room!)[0] ?? 301))"
                :alt="`slide ${i + 1}`"
                loading="lazy"
              />
              <div v-if="item.type === 'video'" class="rooms__thumb-play">
                <LucideIcon name="play" :size="12" color="#fff" />
              </div>
            </button>
          </div>

          <button class="rooms__thumbs-arrow rooms__thumbs-arrow--right" @click="scrollThumbs(1)" aria-label="Siguiente">
            <LucideIcon name="chevron-right" :size="16" color="var(--dark)" />
          </button>
        </div>
      </div>
      <div v-else class="container rooms__empty">
        <LucideIcon name="image-off" :size="32" color="var(--dark-muted)" />
        <span>{{ t('rooms.mediaVideos') }}</span>
      </div>
    </ClientOnly>

    <!-- YouTube channel link -->
    <div class="container rooms__yt-row">
      <a :href="YT_SHORTS_URL" target="_blank" rel="noopener noreferrer" class="rooms__yt-btn">
        <LucideIcon name="youtube" :size="16" color="#fff" />
        {{ t('rooms.ytChannel') }}
      </a>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb-fade">
        <div
          v-if="lbOpen"
          class="lb"
          @click.self="closeLb"
          @wheel.prevent="onLbWheel"
          @mousedown="onLbDown"
          @mousemove="onLbMove"
          @mouseup="onLbUp"
          @mouseleave="onLbUp"
        >
          <button class="lb__close" @click="closeLb">
            <LucideIcon name="x" :size="22" color="#fff" />
          </button>
          <button class="lb__nav lb__nav--prev" @click.stop="lbPrev">
            <LucideIcon name="chevron-left" :size="28" color="#fff" />
          </button>
          <button class="lb__nav lb__nav--next" @click.stop="lbNext">
            <LucideIcon name="chevron-right" :size="28" color="#fff" />
          </button>
          <div
            class="lb__stage"
            :style="{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }"
          >
            <img
              v-if="lbPhotoItems[lbIdx]"
              :src="photoUrl(lbPhotoItems[lbIdx]!.id)"
              alt=""
              class="lb__img"
              draggable="false"
              :style="{ transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)` }"
            />
          </div>
          <div class="lb__counter">{{ lbIdx + 1 }} / {{ lbPhotoItems.length }}</div>
          <div v-if="zoom === 1" class="lb__zoom-hint">
            <LucideIcon name="zoom-in" :size="14" color="rgba(255,255,255,0.5)" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import type { RoomType } from '~/types'
import { ROOM_YT, YT_SHORTS_URL } from '~/composables/useRooms'

const { t, tm, rt } = useI18n()
const { photoUrl, roomPhotoIds, roomKeys } = useRooms()

const roomTypes = computed(() =>
  (tm('rooms.types') as any[]).map((type: any) => ({
    label:   rt(type.label),
    icon:    rt(type.icon),
    photoId: type.photoId as number,
    extras:  (type.extras as any[]).map((e: any) => rt(e)),
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

const activeRoom  = ref('All')
const mediaFilter = ref<'all' | 'photos' | 'videos'>('all')

const mediaFilters = [
  { key: 'all'    as const, icon: 'layout-grid', labelKey: 'mediaAll' },
  { key: 'photos' as const, icon: 'image',       labelKey: 'mediaPhotos' },
  { key: 'videos' as const, icon: 'play-circle', labelKey: 'mediaVideos' },
]

function onMediaChange(key: 'all' | 'photos' | 'videos') {
  mediaFilter.value = key
  currentSlide.value = 0
}

function onRoomChange(key: string) {
  activeRoom.value = key
  currentSlide.value = 0
}

type MediaItem =
  | { type: 'photo'; id: number }
  | { type: 'video'; room: string }

const mediaItems = computed((): MediaItem[] => {
  const ids = roomPhotoIds(activeRoom.value)
  const items: MediaItem[] = ids.map(id => ({ type: 'photo', id }))

  const hasVideo = activeRoom.value !== 'All' && ROOM_YT[activeRoom.value]
  if (hasVideo && mediaFilter.value !== 'photos') {
    items.splice(2, 0, { type: 'video', room: activeRoom.value })
  }

  if (mediaFilter.value === 'photos') return items.filter(m => m.type === 'photo')
  if (mediaFilter.value === 'videos') return items.filter(m => m.type === 'video')
  return items
})

const lbPhotoItems = computed((): Array<{ id: number }> =>
  mediaItems.value.filter(m => m.type === 'photo') as Array<{ type: 'photo'; id: number }>
)

const currentSlide    = ref(0)
const mainCarouselRef = ref<InstanceType<typeof Carousel> | null>(null)
const thumbsRef       = ref<HTMLElement | null>(null)

function onSlideEnd({ currentSlide: s }: { currentSlide: number }) {
  currentSlide.value = s
  scrollThumb(s)
}

function goToSlide(i: number) {
  currentSlide.value = i
  scrollThumb(i)
}

function scrollThumb(i: number) {
  nextTick(() => {
    const el = thumbsRef.value?.children[i] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

function scrollThumbs(dir: 1 | -1) {
  thumbsRef.value?.scrollBy({ left: dir * 200, behavior: 'smooth' })
}

function handleSlideClick(i: number, item: MediaItem) {
  if (item.type === 'video') {
    window.open(`https://www.youtube.com/shorts/${ROOM_YT[item.room!]}`, '_blank')
    return
  }
  const photoIdx = lbPhotoItems.value.findIndex(p => p.id === (item as { id: number }).id)
  openLb(photoIdx >= 0 ? photoIdx : 0)
}

// Thumbnail drag scroll
let thumbDragging = false
let thumbStartX   = 0
let thumbScrollLeft = 0

function onThumbDragStart(e: MouseEvent) {
  if (!thumbsRef.value) return
  thumbDragging  = true
  thumbStartX    = e.pageX - thumbsRef.value.offsetLeft
  thumbScrollLeft = thumbsRef.value.scrollLeft
  thumbsRef.value.style.cursor = 'grabbing'
}
function onThumbDragMove(e: MouseEvent) {
  if (!thumbDragging || !thumbsRef.value) return
  e.preventDefault()
  const x    = e.pageX - thumbsRef.value.offsetLeft
  const walk = (x - thumbStartX) * 1.5
  thumbsRef.value.scrollLeft = thumbScrollLeft - walk
}
function onThumbDragEnd() {
  thumbDragging = false
  if (thumbsRef.value) thumbsRef.value.style.cursor = ''
}

// Lightbox
const lbOpen   = ref(false)
const lbIdx    = ref(0)
const zoom     = ref(1)
const panX     = ref(0)
const panY     = ref(0)
const dragging = ref(false)
let dX = 0, dY = 0

function openLb(i: number) { lbIdx.value = i; lbOpen.value = true; resetZoom() }
function closeLb() { lbOpen.value = false }
function lbPrev() { lbIdx.value = (lbIdx.value - 1 + lbPhotoItems.value.length) % lbPhotoItems.value.length; resetZoom() }
function lbNext() { lbIdx.value = (lbIdx.value + 1) % lbPhotoItems.value.length; resetZoom() }
function resetZoom() { zoom.value = 1; panX.value = 0; panY.value = 0 }

function onLbWheel(e: WheelEvent) {
  const f = e.deltaY < 0 ? 1.15 : 1 / 1.15
  zoom.value = Math.max(1, Math.min(5, zoom.value * f))
  if (zoom.value === 1) { panX.value = 0; panY.value = 0 }
}
function onLbDown(e: MouseEvent) {
  if (zoom.value <= 1) return
  dragging.value = true; dX = e.clientX - panX.value; dY = e.clientY - panY.value
}
function onLbMove(e: MouseEvent) {
  if (!dragging.value) return
  panX.value = e.clientX - dX; panY.value = e.clientY - dY
}
function onLbUp() { dragging.value = false }

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (!lbOpen.value) return
    if (e.key === 'Escape')     closeLb()
    if (e.key === 'ArrowLeft')  lbPrev()
    if (e.key === 'ArrowRight') lbNext()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
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

/* Filters */
.rooms__filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 20px;
}
.rooms__media-toggle { display: flex; background: var(--green-light); border-radius: 22px; padding: 4px; }
.rooms__media-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 18px; border: none;
  background: transparent; color: var(--dark-muted);
  cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600;
  transition: all 0.2s;
}
.rooms__media-btn--active { background: var(--green); color: #fff; }

/* Desktop tabs */
.rooms__room-tabs--desktop {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
  justify-content: flex-end;
}
.rooms__room-tabs--desktop::-webkit-scrollbar { display: none; }

.rooms__tab {
  flex-shrink: 0;
  padding: 7px 16px; border-radius: 20px;
  border: 1.5px solid var(--border); background: #fff;
  color: var(--dark-muted); cursor: pointer; font-family: inherit;
  font-size: 13px; font-weight: 500; transition: all 0.2s;
}
.rooms__tab--active { border-color: var(--green); background: var(--green); color: #fff; }

/* Mobile select */
.rooms__room-tabs--mobile {
  display: none;
  flex: 1;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  color: var(--dark);
  cursor: pointer;
  outline: none;
  appearance: auto;
}

@media (max-width: 700px) {
  .rooms__room-tabs--desktop { display: none; }
  .rooms__room-tabs--mobile  { display: block; }
}

/* Gallery carousel — full width, no margins */
.rooms__gallery { margin-top: 8px; }

.rooms__slide {
  padding: 0 4px;
  cursor: pointer;
  width: 100%;
}

.rooms__slide-img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  transition: transform 0.3s;
}
.rooms__slide:hover .rooms__slide-img { transform: scale(1.01); }

.rooms__slide-video {
  width: auto;
  max-width: calc(500px * 9 / 16);
  height: 500px;
  margin: 0 auto;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
}
.rooms__slide-video::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: rgba(0,0,0,0.45);
}
.rooms__play-btn {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(220,30,30,0.9);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 24px rgba(0,0,0,0.5);
  position: relative; z-index: 1;
  transition: transform 0.2s;
}
.rooms__slide-video:hover .rooms__play-btn { transform: scale(1.1); }
.rooms__video-lbl { color: #fff; font-size: 13px; font-weight: 700; text-shadow: 0 2px 6px rgba(0,0,0,0.8); position: relative; z-index: 1; }

/* vue3-carousel arrow overrides */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background: rgba(255,255,255,0.92);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  color: var(--dark);
}
:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) { background: #fff; }

:deep(.carousel__icon) {
  fill: var(--dark);
  stroke: var(--dark);
  width: 22px;
  height: 22px;
}

/* Thumbnails */
.rooms__thumbs-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px max(16px, 2vw) 4px;
}

.rooms__thumbs-arrow {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.rooms__thumbs-arrow:hover { background: var(--green-light); border-color: var(--green); }

.rooms__thumbs {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  cursor: grab;
  user-select: none;
}
.rooms__thumbs::-webkit-scrollbar { display: none; }
.rooms__thumbs:active { cursor: grabbing; }

.rooms__thumb {
  flex-shrink: 0;
  width: 72px;
  height: 54px;
  border-radius: 6px;
  overflow: hidden;
  border: 2.5px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.2s, opacity 0.2s;
  position: relative;
  opacity: 0.65;
}
.rooms__thumb--active { border-color: var(--green); opacity: 1; }
.rooms__thumb:hover { opacity: 1; }
.rooms__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rooms__thumb-play {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.35);
}

/* YouTube channel link */
.rooms__yt-row {
  display: flex;
  justify-content: center;
  padding-top: 24px;
}
.rooms__yt-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ff0000;
  color: #fff;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
}
.rooms__yt-btn:hover { opacity: 0.85; }

.rooms__empty {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding: 80px 24px;
  color: var(--dark-muted); font-size: 15px;
}

/* Lightbox */
.lb {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.lb__close {
  position: absolute; top: 16px; right: 20px;
  background: rgba(255,255,255,0.12); border: none;
  border-radius: 50%; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 2; transition: background 0.2s;
}
.lb__close:hover { background: rgba(255,255,255,0.22); }
.lb__nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.12); border: none;
  border-radius: 50%; width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 2; transition: background 0.2s;
}
.lb__nav:hover { background: rgba(255,255,255,0.22); }
.lb__nav--prev { left: 16px; }
.lb__nav--next { right: 16px; }
.lb__stage {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}
.lb__img {
  max-width: 90vw; max-height: 90vh;
  object-fit: contain; border-radius: 8px;
  user-select: none; pointer-events: none;
  transition: transform 0.12s ease-out;
}
.lb__counter {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.55); font-size: 13px;
}
.lb__zoom-hint { position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%); }
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.2s; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .rooms__slide-img,
  .rooms__slide-video { height: 300px; }
}
</style>
