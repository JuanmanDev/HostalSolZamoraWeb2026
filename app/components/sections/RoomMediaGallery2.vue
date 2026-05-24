<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ROOM_YT, YT_SHORTS_URL, ROOM_TYPES } from '~/composables/useRooms'

const props = defineProps<{
  initialRoom?: string
  initialMedia?: 'all' | 'photos' | 'videos'
  hideThumbailsAll?: boolean
  hideGrouped?: boolean
}>()


const currentSlide = ref(0)

const slideTo = (nextSlide) => (currentSlide.value = nextSlide)

const autoplayDelay = ref(7000)
let pauseTimeout: ReturnType<typeof setTimeout> | null = null

function pauseCarousel() {
  autoplayDelay.value = 0
  if (pauseTimeout) clearTimeout(pauseTimeout)
  pauseTimeout = setTimeout(() => {
    autoplayDelay.value = 7000
  }, 120000) // 2 minutes
}

const galleryConfig = computed(() => ({
  itemsToShow: 1,
  wrapAround: true,
  slideEffect: 'fade',
  mouseDrag: false,
  touchDrag: false,
  height: "75vh",
  autoplay: autoplayDelay.value,
  pauseAutoplayOnHover: true,
}))

const thumbnailsConfig = {
  height: 80,
  itemsToShow: 6,
  wrapAround: false,
  touchDrag: false,
  gap: 10,
}

const { t } = useI18n()
const { photoUrl, roomPhotoPaths, roomKeys, typeKeys } = useRooms()
const emit = defineEmits(['update:room', 'update:media'])

const activeRoom  = ref(props.initialRoom || 'All')
const mediaFilter = ref<'all' | 'photos' | 'videos'>(props.initialMedia || 'all')

const isMultipleRooms = computed(() => activeRoom.value === 'All' || typeKeys.includes(activeRoom.value))

const mediaFilters = [
  { key: 'all'    as const, icon: 'layout-grid', labelKey: 'mediaAll' },
  { key: 'photos' as const, icon: 'image',       labelKey: 'mediaPhotos' },
  { key: 'videos' as const, icon: 'play-circle', labelKey: 'mediaVideos' },
]

function onMediaChange(key: 'all' | 'photos' | 'videos') {
  mediaFilter.value = key
  currentSlide.value = 0
  emit('update:media', key)

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('gallery-media-filter', {
      filter: key,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

function onRoomChange(key: string) {
  activeRoom.value = key
  currentSlide.value = 0
  emit('update:room', key)

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('gallery-room-filter', {
      room: key,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

type MediaItem =
  | { type: 'photo'; path: string }
  | { type: 'video'; room: string }

const mediaItems = computed((): MediaItem[] => {
  const items: MediaItem[] = []

  if (activeRoom.value === 'All' || typeKeys.includes(activeRoom.value)) {
    const roomsToShow = activeRoom.value === 'All' ? roomKeys : ROOM_TYPES[activeRoom.value]

    if (mediaFilter.value === 'videos') {
      return roomsToShow
        .filter(room => ROOM_YT[room])
        .map(room => ({ type: 'video', room }))
    }

    for (const room of roomsToShow) {
      const paths = roomPhotoPaths(room)
      const roomItems: MediaItem[] = paths.map(path => ({ type: 'photo', path }))

      if (mediaFilter.value === 'all' && ROOM_YT[room]) {
        const insertIdx = Math.min(2, roomItems.length)
        roomItems.splice(insertIdx, 0, { type: 'video', room })
      }

      items.push(...roomItems)
    }

  } else {
    const paths = roomPhotoPaths(activeRoom.value)
    const roomItems: MediaItem[] = paths.map(path => ({ type: 'photo', path }))

    if (mediaFilter.value !== 'photos' && ROOM_YT[activeRoom.value]) {
      if (mediaFilter.value === 'videos') {
        return [{ type: 'video', room: activeRoom.value }]
      }
      const insertIdx = Math.min(2, roomItems.length)
      roomItems.splice(insertIdx, 0, { type: 'video', room: activeRoom.value })
    }

    items.push(...roomItems)
  }

  return items
})

const lbPhotoItems = computed((): MediaItem[] => mediaItems.value)

// Main gallery slide duration tracking
let gallerySlideStartTime = Date.now()

const sendGallerySlideDuration = (index: number) => {
  if (!gallerySlideStartTime) return
  const duration = Math.round((Date.now() - gallerySlideStartTime) / 1000)
  if (duration >= 1) {
    try {
      const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
      const item = mediaItems.value[index]
      if (item) {
        umami.track('gallery-slide-view', {
          duration,
          mediaType: item.type,
          mediaPath: item.type === 'photo' ? item.path : item.room,
          pathName: window.location.pathname
        })
      }
    } catch (e) {}
  }
  gallerySlideStartTime = 0
}

// Slide change tracking
watch(currentSlide, (newVal, oldVal) => {
  if (oldVal !== undefined) {
    sendGallerySlideDuration(oldVal)
  }
  gallerySlideStartTime = Date.now()
  
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    const item = mediaItems.value[newVal]
    if (item) {
      umami.track('gallery-slide-change', {
        slideIndex: newVal,
        mediaType: item.type,
        mediaPath: item.type === 'photo' ? item.path : undefined,
        videoRoom: item.type === 'video' ? item.room : undefined,
        path: window.location.pathname
      })
    }
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
})

// Lightbox media duration tracking
let lbImageStartTime = 0

const sendLbImageDuration = (index: number) => {
  if (!lbImageStartTime) return
  const duration = Math.round((Date.now() - lbImageStartTime) / 1000)
  if (duration >= 1) {
    try {
      const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
      const item = lbPhotoItems.value[index]
      if (item) {
        umami.track('lightbox-media-view', {
          duration,
          mediaType: item.type,
          mediaPath: item.type === 'photo' ? item.path : item.room,
          room: activeRoom.value,
          pathName: window.location.pathname
        })
      }
    } catch (e) {
      console.warn('Umami not initialized:', e)
    }
  }
  lbImageStartTime = 0
}

// Lightbox
const lbOpen   = ref(false)
const lbIdx    = ref(0)
const zoom     = ref(1)
const panX     = ref(0)
const panY     = ref(0)
const dragging = ref(false)
const lbLoading = ref(false)
let dX = 0, dY = 0
let startX = 0, startY = 0
let initialPinchDist = 0
let initialPinchZoom = 1

watch(lbOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      lbImageStartTime = Date.now()
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      sendLbImageDuration(lbIdx.value)
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }
})

watch(lbIdx, (newIdx, oldIdx) => {
  if (lbOpen.value) {
    sendLbImageDuration(oldIdx)
    lbImageStartTime = Date.now()
  }
})

// Zoom level tracking with debounce
let zoomDebounceTimer: any = null
watch(zoom, (newZoom) => {
  if (zoomDebounceTimer) clearTimeout(zoomDebounceTimer)
  zoomDebounceTimer = setTimeout(() => {
    try {
      const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
      umami.track('lightbox-zoom', {
        scale: Number(newZoom.toFixed(2)),
        path: lbPhotoItems.value[lbIdx.value]?.path,
        pathName: window.location.pathname
      })
    } catch (e) {
      console.warn('Umami not initialized:', e)
    }
  }, 800)
})

const route = useRoute()
const router = useRouter()

// Sync LB state with URL
function updateLbUrl() {
  if (lbOpen.value) {
    router.replace({ query: { ...route.query, lb: lbIdx.value.toString() } })
  } else {
    const q = { ...route.query }
    delete q.lb
    router.replace({ query: q })
  }
}

function openLb(i: number) { 
  lbIdx.value = i; 
  lbOpen.value = true; 
  resetZoom(); 
  lbLoading.value = true;
  updateLbUrl();

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('lightbox-open', {
      index: i,
      room: activeRoom.value,
      path: lbPhotoItems.value[i]?.path,
      pathName: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

function closeLb() { 
  lbOpen.value = false;
  updateLbUrl();

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('lightbox-close', {
      lastIndex: lbIdx.value,
      pathName: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

function lbPrev() { 
  lbIdx.value = (lbIdx.value - 1 + lbPhotoItems.value.length) % lbPhotoItems.value.length; 
  resetZoom(); 
  lbLoading.value = true;
  updateLbUrl();

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('lightbox-navigate', {
      direction: 'prev',
      newIndex: lbIdx.value,
      path: lbPhotoItems.value[lbIdx.value]?.path,
      pathName: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

function lbNext() { 
  lbIdx.value = (lbIdx.value + 1) % lbPhotoItems.value.length; 
  resetZoom(); 
  lbLoading.value = true;
  updateLbUrl();

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('lightbox-navigate', {
      direction: 'next',
      newIndex: lbIdx.value,
      path: lbPhotoItems.value[lbIdx.value]?.path,
      pathName: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}

function resetZoom() { zoom.value = 1; panX.value = 0; panY.value = 0 }

function toggleZoom() {
  if (zoom.value > 1) {
    resetZoom()
  } else {
    zoom.value = 3
  }
}

function onLbWheel(e: WheelEvent) {
  const f = e.deltaY < 0 ? 1.15 : 1 / 1.15
  zoom.value = Math.max(1, Math.min(5, zoom.value * f))
  if (zoom.value === 1) { panX.value = 0; panY.value = 0 }
}

function getTouchesDist(touches: TouchList) {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.hypot(dx, dy)
}

function getCoords(e: MouseEvent | TouchEvent) {
  if ('touches' in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  if ('changedTouches' in e && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
  }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

function onLbDown(e: MouseEvent | TouchEvent) {
  if ('touches' in e && e.touches.length === 2) {
    initialPinchDist = getTouchesDist(e.touches)
    initialPinchZoom = zoom.value
    dragging.value = true
    return
  }
  const { x, y } = getCoords(e)
  startX = x; startY = y
  dragging.value = true
  if (zoom.value > 1) {
    dX = x - panX.value; dY = y - panY.value
  }
}

function onLbMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  if ('touches' in e && e.touches.length === 2) {
    const dist = getTouchesDist(e.touches)
    const scale = dist / initialPinchDist
    zoom.value = Math.max(1, Math.min(5, initialPinchZoom * scale))
    return
  }
  const { x, y } = getCoords(e)
  if (zoom.value > 1) {
    panX.value = x - dX; panY.value = y - dY
  }
}

function onLbUp(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  if ('touches' in e && e.touches.length > 0) return // Still fingers on screen
  
  if (initialPinchDist > 0) {
    initialPinchDist = 0
    dragging.value = false
    return
  }

  const { x, y } = getCoords(e)
  const diffX = x - startX
  const diffY = y - startY
  const dist = Math.hypot(diffX, diffY)

  if (dist < 5) {
    toggleZoom()
  } else if (zoom.value === 1) {
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) lbPrev()
      else lbNext()
    }
  }
  dragging.value = false
}

onMounted(() => {
  // Check URL for initial lightbox state
  if (route.query.lb !== undefined) {
    const initialIdx = parseInt(route.query.lb as string, 10)
    if (!isNaN(initialIdx) && initialIdx >= 0 && initialIdx < lbPhotoItems.value.length) {
      lbIdx.value = initialIdx
      lbOpen.value = true
      lbLoading.value = true
    }
  }

  const handler = (e: KeyboardEvent) => {
    if (!lbOpen.value) return
    if (e.key === 'Escape')     closeLb()
    if (e.key === 'ArrowLeft')  lbPrev()
    if (e.key === 'ArrowRight') lbNext()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})




function handleSlideClick(i: number, item: MediaItem) {
  const lbIdx = lbPhotoItems.value.findIndex(m => 
    m.type === 'photo' && item.type === 'photo' ? m.path === item.path :
    m.type === 'video' && item.type === 'video' ? m.room === item.room : false
  )
  openLb(lbIdx >= 0 ? lbIdx : 0)
}
</script>

<template>

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
          <span>
            {{ t(`rooms.${m.labelKey}`) }}
          </span>
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
        
        <!-- Room Types -->
        <button
          v-for="key in typeKeys"
          :key="key"
          :class="['room-gallery__tab', { 'room-gallery__tab--active': activeRoom === key }]"
          @click="onRoomChange(key)"
        >
          {{ t(`rooms.filter${key.replace(' ', '')}`) }}
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
        <optgroup :label="t('rooms.title')">
          <option v-for="key in typeKeys" :key="key" :value="key">
            {{ t(`rooms.filter${key.replace(' ', '')}`) }}
          </option>
        </optgroup>
        <optgroup label="Habitaciones">
          <option v-for="key in roomKeys" :key="key" :value="key">
            {{ key === 'Entrada' ? t('rooms.entrance') : key }}
          </option>
        </optgroup>
      </select>
    </div>

    <Carousel id="gallery" v-bind="galleryConfig" v-model="currentSlide" @mousedown.capture="pauseCarousel" @touchstart.capture="pauseCarousel">
      <Slide v-for="(image, i) in mediaItems" :key="`${image.type}-${i}`">
        <template #default="{ isActive, isVisible }">
          <template v-if="isVisible || isActive">
            <NuxtPicture
                v-if="image.type === 'photo'"
                :src="image.path"
                alt="Gallery Image"
                class="gallery-image"
                @click="handleSlideClick(i, image)"
                sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 3xl:100vw 4xl:100vw 5xl:100vw"
                :modifiers="{ rotate: 0 }"
                :loading="i === 0 ? 'eager' : 'lazy'"
            />
            <div v-else class="video-placeholder">
              <iframe v-if="isActive" width="100%" height="100%" :src="`https://www.youtube.com/embed/${ROOM_YT[image.room!]}?rel=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=${ROOM_YT[image.room!]}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </template>
        </template>
      </Slide>
    </Carousel>

    <!-- 
      Hidden container for crawler discovery. 
      Nuxt Image needs to see these tags in the HTML to optimize images during 'generate'.
    -->
    <div style="display: none;" aria-hidden="true">
      <NuxtPicture
        v-for="path in roomPhotoPaths('All')"
        :key="path"
        :src="path"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 3xl:100vw 4xl:100vw 5xl:100vw"
        :modifiers="{ rotate: 0 }"
      />
      <!-- Pre-render miniature thumbnails so client-side room filters do not fail on static export -->
      <NuxtImg
        v-for="path in roomPhotoPaths('All')"
        :key="`thumb-pre-${path}`"
        :src="path"
        width="80"
        height="60"
        format="webp"
        :modifiers="{ rotate: 0 }"
      />
    </div>

    <Carousel id="thumbnails" v-bind="thumbnailsConfig" v-model="currentSlide" @mousedown.capture="pauseCarousel" @touchstart.capture="pauseCarousel">
      <Slide v-for="(image, i) in mediaItems" :key="`thumb-${image.type}-${i}`">
        <template #default="{ currentIndex, isActive }">
          <div
            :class="['thumbnail', { 'is-active': isActive }]"
            @click="slideTo(currentIndex)"
          >
            <NuxtImg
                v-if="image.type === 'photo'"
                :src="image.path"
                alt="Thumbnail Image"
                class="thumbnail-image"
                width="120"
                height="80"
                format="webp"
                loading="lazy"
                :modifiers="{ rotate: 0 }"
            />
            <div v-else class="video-placeholder thumbnail-video">
              <LucideIcon class="thumbnail-video__play" name="play-circle" :size="32" color="#fff" />
              <img
                  :src="`https://i.ytimg.com/vi/${ROOM_YT[image.room!]}/default.jpg`"
                  alt="Video Thumbnail"
                  class="thumbnail-image"
                  loading="lazy"
              />
            </div>
          </div>
        </template>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>

  <div v-if="!props.hideThumbailsAll">


    <!-- Show a miniature of all media items -->
    <div v-if="!isMultipleRooms" class="room-gallery__thumbnails">
      <div
        v-for="(image, i) in mediaItems"
        :key="`mini-${image.type}-${i}`"
        class="room-gallery__thumbnail"
        @click="slideTo(i); handleSlideClick(mediaItems.findIndex(m => (m.type === 'photo' ? m.path === image.path : m.room === image.room)), image)"
      >
        <NuxtImg
            v-if="image.type === 'photo'"
            :src="image.path"
            alt="Thumbnail Image"
            class="thumbnail-image"
            width="80"
            height="60"
            format="webp"
            loading="lazy"
            :modifiers="{ rotate: 0 }"
        />
        <div v-else class="video-placeholder thumbnail-video">
          <LucideIcon class="thumbnail-video__play" name="play-circle" :size="24" color="#fff" />
        </div>
      </div>
    </div>

    <!-- If all media are showing or a type is selected, group by room -->
    <div v-if="isMultipleRooms && !props.hideGrouped" class="room-gallery__grouped">
      <div 
        v-for="key in (activeRoom === 'All' ? roomKeys : ROOM_TYPES[activeRoom])" 
        :key="key" 
        class="room-gallery__group"
      >
        <p class="room-gallery__group-title">{{ key === 'Entrada' ? t('rooms.entrance') : key }}</p>
        <div class="room-gallery__group-items">
          <div
            v-for="item in mediaItems.filter(m => (m.type === 'photo' ? roomPhotoPaths(key).includes(m.path) : m.room === key))"
            :key="`${item.type}-${item.type === 'photo' ? item.path : item.room}`"
            class="room-gallery__group-item"
            @click="handleSlideClick(mediaItems.findIndex(m => (m.type === 'photo' ? m.path === item.path : m.room === item.room)), item)"
          >
            <NuxtImg
                v-if="item.type === 'photo'"
                :src="item.path"
                alt="Media Image"
                class="thumbnail-image"
                width="140"
                height="93"
                format="webp"
                loading="lazy"
                :modifiers="{ rotate: 0 }"
            />
            <div v-else class="video-placeholder thumbnail-video">
              <LucideIcon class="thumbnail-video__play" name="play-circle" :size="24" color="#fff" />
              <img :src="`https://i.ytimg.com/vi/${ROOM_YT[item.room!]}/default.jpg`" alt="Video Thumbnail" class="thumbnail-image" />
            </div>
          </div>
        </div>  
      </div> 
    </div>
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
          @touchstart="onLbDown"
          @touchmove="onLbMove"
          @touchend="onLbUp"
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
            <!-- Loader -->
            <div v-if="lbLoading" class="lb__loader">
              <div class="lb__spinner"></div>
              <img src="/images/logo-icon.svg" class="lb__loader-logo" alt="Loading..." />
            </div>

            <img
              v-if="lbPhotoItems[lbIdx] && lbPhotoItems[lbIdx].type === 'photo' && zoom > 1"
              :src="lbPhotoItems[lbIdx].path"
              alt=""
              class="lb__img"
              draggable="false"
              @load="lbLoading = false"
              :style="{ 
                transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                transition: dragging ? 'none' : 'transform 0.3s ease-out'
              }"
            />
            <NuxtPicture
              v-else-if="lbPhotoItems[lbIdx] && lbPhotoItems[lbIdx].type === 'photo'"
              :src="lbPhotoItems[lbIdx].path"
              alt=""
              class="lb__img"
              @load="lbLoading = false"
              :img-attrs="{
                draggable: 'false',
                style: { 
                  transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                  transition: dragging ? 'none' : 'transform 0.3s ease-out'
                }
              }"
              sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 3xl:100vw 4xl:100vw 5xl:100vw"
              :modifiers="{ rotate: 0 }"
            />
            <div v-else
              class="lb__video-placeholder">
              <iframe width="100%" height="100%" :src="`https://www.youtube.com/embed/${ROOM_YT[mediaItems[lbIdx].room!]}?rel=0&amp;autoplay=1&amp;loop=1&amp;playlist=${ROOM_YT[mediaItems[lbIdx].room!]}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen @load="lbLoading = false"></iframe>
            </div>
          </div>
          <div class="lb__counter">{{ lbIdx + 1 }} / {{ lbPhotoItems.length }}</div>
          <div v-if="zoom === 1" class="lb__zoom-hint">
            <LucideIcon name="zoom-in" :size="14" color="rgba(255,255,255,0.5)" />
          </div>
        </div>
      </Transition>
    </Teleport>
</template>

<style>


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

.gallery-image {
  border-radius: 16px;
  width: 100%;
  height: 100%;
  display: block;
}

.gallery-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 8px;
}

#thumbnails {
  margin-top: 10px;
}

.thumbnail {
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;
}

.thumbnail.is-active,
.thumbnail:hover {
  opacity: 1;
}

.video-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}
</style>










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
  padding: 8px 0 20px;
  margin: 0 auto;
  max-width: 1800px;
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

@media (max-width: 600px) {
  .room-gallery__media-btn span { display: none; }
}

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

@media (max-width: 1750px) {
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
  padding: 10px 22px; font-size: 14px;
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

.thumbnail-video {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;

}

.thumbnail-video__play {
  position: absolute; inset: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.25);
  border-radius: 50%;
}

.room-gallery__thumbnails {
  display: flex;
  gap: 10px;
  padding: 16px max(16px, 2vw);
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  flex-wrap: wrap;

}
.room-gallery__thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 2.5px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.2s, opacity 0.2s;
  position: relative;
  opacity: 0.65;
}

.gallery-image-placeholder {
  height: 75vh;
  width: 100%;
  background: #f5f5f5;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer; z-index: 10; transition: background 0.2s;
}
.lb__close:hover { background: rgba(255,255,255,0.22); }
.lb__nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.12); border: none;
  border-radius: 50%; width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10; transition: background 0.2s;
}
.lb__nav:hover { background: rgba(255,255,255,0.22); }
.lb__nav--prev { left: 16px; }
.lb__nav--next { right: 16px; }
.lb__stage {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}
.lb__img {
  max-width: 98vw; max-height: 98vh;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  user-select: none;
  flex-grow: 1;
  flex-shrink: 1;
  z-index: 2;
}
.lb__img :deep(img) {
  max-width: 98vw;
  max-height: 98vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
}

.lb__loader {
  position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  z-index: 1;
  display: flex; align-items: center; justify-content: center;
}
.lb__spinner {
  width: 80px; height: 80px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: lb-spin 1s linear infinite;
}
.lb__loader-logo {
  position: absolute;
  width: 40px; height: 40px;
  object-fit: contain;
  border-radius: 0;
}
@keyframes lb-spin { to { transform: rotate(360deg); } }
.lb__video-placeholder {
  width: 90vw; height: 80vh;
  display: flex; align-items: center; justify-content: center;
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


.room-gallery__grouped {
  margin-top: 40px;
}
.room-gallery__group {
  margin-bottom: 32px;
  background: var(--border);
  border: 3px solid var(--border);
  border-radius: 2rem;
}
.room-gallery__group-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 2rem;
  padding-top: 4px;
  color: var(--dark);
}
.room-gallery__group-items {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  flex-wrap: wrap;
  justify-content: space-around
}
.room-gallery__group-item {

  width: clamp(80px, 30vw, 150px);
  min-width: auto; /* Sobrescribimos el min-width fijo */
}

.room-gallery__group-item .video-placeholder.thumbnail-video {
  border-radius: 12px;
}
</style>
