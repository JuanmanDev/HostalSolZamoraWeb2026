<template>
  <div class="room-gallery">
    <!-- Filter bar -->
    <div class="room-gallery__filters">
      <div class="room-gallery__media-toggle">
        <button
          v-for="m in mediaFilters"
          :key="m.key"
          :class="['room-gallery__media-btn', { 'room-gallery__media-btn--active': mediaFilter === m.key }]"
          @click="onMediaChange(m.key)"
        >
          <LucideIcon :name="m.icon" :size="13" />
          {{ t(`rooms.${m.labelKey}`) }}
        </button>
      </div>

      <!-- Room tabs: horizontal scroll on desktop, <select> on mobile -->
      <div class="room-gallery__room-tabs room-gallery__room-tabs--desktop">
        <button
          :class="['room-gallery__tab', { 'room-gallery__tab--active': activeRoom === 'All' }]"
          @click="onRoomChange('All')"
        >
          {{ t('rooms.filterAll') }}
        </button>
        <button
          v-for="key in roomKeys"
          :key="key"
          :class="['room-gallery__tab', { 'room-gallery__tab--active': activeRoom === key }]"
          @click="onRoomChange(key)"
        >
          {{ key === 'Entrada' ? t('rooms.entrance') : key }}
        </button>
      </div>

      <select
        class="room-gallery__room-select room-gallery__room-tabs--mobile"
        :value="activeRoom"
        @change="onRoomChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="All">{{ t('rooms.filterAll') }}</option>
        <option v-for="key in roomKeys" :key="key" :value="key">
          {{ key === 'Entrada' ? t('rooms.entrance') : key }}
        </option>
      </select>
    </div>

    <!-- Full-width carousel -->
    <!-- <ClientOnly> -->
      <div v-if="mediaItems.length > 0" class="room-gallery__carousel-wrap">
        <Carousel
          ref="mainCarouselRef"
          v-model="currentSlide"
          :wrap-around="true"
          :autoplay="4500"
          :transition="600"
          snap-align="center"
          :pause-autoplay-on-hover="true"
          :mouse-drag="true"
          :touch-drag="true"
          itemsToShow="auto"
          @slide-end="onSlideEnd"
        >
          <Slide v-for="(item, i) in mediaItems" :key="`${item.type}-${item.type === 'photo' ? item.path : item.room}-${i}`">
            <div class="room-gallery__slide">
              <NuxtPicture
                v-if="item.type === 'photo'"
                :src="item.path"
                :alt="`Habitación ${activeRoom}`"
                :loading="i === 0 ? 'eager' : 'lazy'"
                class="room-gallery__slide-img"
                @click="handleSlideClick(i, item)"
              />
              <div v-else class="room-gallery__slide-video-wrap">
                <iframe width="100%" height="100%" :src="`https://www.youtube.com/embed/${ROOM_YT[item.room!]}?rel=0&amp;autoplay=1&amp;loop=1&amp;playlist=${ROOM_YT[item.room!]}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>

        <!-- Thumbnails -->
        <div class="room-gallery__thumbs-wrap">
          <button class="room-gallery__thumbs-arrow room-gallery__thumbs-arrow--left" @click="scrollThumbs(-1)" aria-label="Anterior">
            <LucideIcon name="chevron-left" :size="16" color="var(--dark)" />
          </button>

          <div
            ref="thumbsRef"
            class="room-gallery__thumbs"
            @mousedown="onThumbDragStart"
            @mousemove="onThumbDragMove"
            @mouseup="onThumbDragEnd"
            @mouseleave="onThumbDragEnd"
          >
            <button
              v-for="(item, i) in mediaItems"
              :key="i"
              :class="['room-gallery__thumb', { 'room-gallery__thumb--active': i === currentSlide }]"
              @click="goToSlide(i)"
            >
              <NuxtPicture
                :src="item.type === 'photo' ? item.path : (roomPhotoPaths(item.room!)[0] ?? '/images/rooms/1.jpg')"
                :alt="`slide ${i + 1}`"
                loading="lazy"
              />
              <div v-if="item.type === 'video'" class="room-gallery__thumb-play">
                <LucideIcon name="play" :size="12" color="#fff" />
              </div>
            </button>
          </div>

          <button class="room-gallery__thumbs-arrow room-gallery__thumbs-arrow--right" @click="scrollThumbs(1)" aria-label="Siguiente">
            <LucideIcon name="chevron-right" :size="16" color="var(--dark)" />
          </button>
        </div>
      </div>
      <div v-else class="room-gallery__empty">
        <LucideIcon name="image-off" :size="32" color="var(--dark-muted)" />
        <span>{{ t('rooms.emptyMedia') }}</span>
      </div>
    <!-- </ClientOnly> -->

    <!-- YouTube channel link -->
    <div class="room-gallery__yt-row">
      <a :href="YT_SHORTS_URL" target="_blank" rel="noopener noreferrer" class="room-gallery__yt-btn">
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
            <NuxtPicture
              v-if="lbPhotoItems[lbIdx]"
              :src="lbPhotoItems[lbIdx]!.path"
              alt=""
              class="lb__img"
              :img-attrs="{
                draggable: 'false',
                style: { transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)` }
              }"
            />
          </div>
          <div class="lb__counter">{{ lbIdx + 1 }} / {{ lbPhotoItems.length }}</div>
          <div v-if="zoom === 1" class="lb__zoom-hint">
            <LucideIcon name="zoom-in" :size="14" color="rgba(255,255,255,0.5)" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ROOM_YT, YT_SHORTS_URL } from '~/composables/useRooms'

const props = defineProps<{
  initialRoom?: string
  initialMedia?: 'all' | 'photos' | 'videos'
}>()

const emit = defineEmits<{
  (e: 'update:room', value: string): void
  (e: 'update:media', value: 'all' | 'photos' | 'videos'): void
}>()

const { t } = useI18n()
const { photoUrl, roomPhotoPaths, roomKeys } = useRooms()

const activeRoom  = ref(props.initialRoom || 'All')
const mediaFilter = ref<'all' | 'photos' | 'videos'>(props.initialMedia || 'all')

const mediaFilters = [
  { key: 'all'    as const, icon: 'layout-grid', labelKey: 'mediaAll' },
  { key: 'photos' as const, icon: 'image',       labelKey: 'mediaPhotos' },
  { key: 'videos' as const, icon: 'play-circle', labelKey: 'mediaVideos' },
]

function onMediaChange(key: 'all' | 'photos' | 'videos') {
  mediaFilter.value = key
  currentSlide.value = 0
  emit('update:media', key)
}

function onRoomChange(key: string) {
  activeRoom.value = key
  currentSlide.value = 0
  emit('update:room', key)
}

type MediaItem =
  | { type: 'photo'; path: string }
  | { type: 'video'; room: string }

const mediaItems = computed((): MediaItem[] => {
  const paths = roomPhotoPaths(activeRoom.value)
  const items: MediaItem[] = paths.map(path => ({ type: 'photo', path }))

  if (activeRoom.value === 'All') {
    const videoItems: MediaItem[] = Object.keys(ROOM_YT).map(room => ({ type: 'video', room }))
    
    if (mediaFilter.value === 'videos') {
      return videoItems
    }
    
    // For "all" media filter, mix in some videos at intervals or at the end
    // Let's prepend them for visibility or mix them
    if (mediaFilter.value === 'all') {
      // Add a few videos at the start or end
      items.splice(2, 0, ...videoItems.slice(0, 3))
    }
  } else {
    const hasVideo = ROOM_YT[activeRoom.value]
    if (hasVideo && mediaFilter.value !== 'photos') {
      items.splice(2, 0, { type: 'video', room: activeRoom.value })
    }
  }

  if (mediaFilter.value === 'photos') return items.filter(m => m.type === 'photo')
  if (mediaFilter.value === 'videos') return items.filter(m => m.type === 'video')
  return items
})

const lbPhotoItems = computed((): Array<{ path: string }> =>
  mediaItems.value.filter(m => m.type === 'photo') as Array<{ type: 'photo'; path: string }>
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
  if (item.type === 'video') return
  
  const photoIdx = lbPhotoItems.value.findIndex(p => p.path === (item as { path: string }).path)
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
.room-gallery {
  margin: 32px 0;
}
.room-gallery__filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  padding: 8px 16px 20px;
  margin: 0 auto;
  max-width: 1500px;
}
.room-gallery__media-toggle { display: flex; background: var(--green-light); border-radius: 22px; padding: 4px; }
.room-gallery__media-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 18px; border: none;
  background: transparent; color: var(--dark-muted);
  cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600;
  transition: all 0.2s;
}
.room-gallery__media-btn--active { background: var(--green); color: #fff; }

/* Desktop tabs */
.room-gallery__room-tabs--desktop {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
  justify-content: flex-end;
}
.room-gallery__room-tabs--desktop::-webkit-scrollbar { display: none; }

.room-gallery__tab {
  flex-shrink: 0;
  padding: 7px 16px; border-radius: 20px;
  border: 1.5px solid var(--border); background: #fff;
  color: var(--dark-muted); cursor: pointer; font-family: inherit;
  font-size: 13px; font-weight: 500; transition: all 0.2s;
}
.room-gallery__tab--active { border-color: var(--green); background: var(--green); color: #fff; }

/* Mobile select */
.room-gallery__room-tabs--mobile {
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

  max-width: 250px;
}

@media (max-width: 1500px) {
  .room-gallery__room-tabs--desktop { display: none; }
  .room-gallery__room-tabs--mobile  { display: block; }
}

/* Gallery carousel — full width, no margins */
.room-gallery__carousel-wrap { margin-top: 8px; }

.room-gallery__slide {
  padding: 0 4px;
  width: 100%;
  max-width: 90vw;
}

.room-gallery__slide-img {
  /* width: 100%; */
  width: 90vw;
  height: 500px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  transition: transform 0.3s;
  cursor: pointer;
}
.room-gallery__slide:hover .room-gallery__slide-img { transform: scale(1.01); }

.room-gallery__slide-video-wrap {
  width: auto;
  max-width: calc(500px * 9 / 16);
  height: 500px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-gallery__script-player {
  width: 100% !important;
  height: 100% !important;
}

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
.room-gallery__thumbs-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px max(16px, 2vw) 4px;
}

.room-gallery__thumbs-arrow {
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
.room-gallery__thumbs-arrow:hover { background: var(--green-light); border-color: var(--green); }

.room-gallery__thumbs {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  cursor: grab;
  user-select: none;
}
.room-gallery__thumbs::-webkit-scrollbar { display: none; }
.room-gallery__thumbs:active { cursor: grabbing; }

.room-gallery__thumb {
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
.room-gallery__thumb--active { border-color: var(--green); opacity: 1; }
.room-gallery__thumb:hover { opacity: 1; }
.room-gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.room-gallery__thumb-play {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.35);
}

/* YouTube channel link */
.room-gallery__yt-row {
  display: flex;
  justify-content: center;
  padding-top: 24px;
}
.room-gallery__yt-btn {
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
.room-gallery__yt-btn:hover { opacity: 0.85; }

.room-gallery__empty {
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
  .room-gallery__slide-img,
  .room-gallery__slide-video-wrap { height: 300px; }
}
</style>
