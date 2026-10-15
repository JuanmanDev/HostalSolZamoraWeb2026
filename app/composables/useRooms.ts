export const ROOM_YT: Record<string, string> = {
  'Entrada': 'YcVZ8ocHHpI',
  '324':     'tHC0JGVRogE',
  '323':     'aOf_-zqVits',
  '322':     'FFN2WmsQwCA',
  '321':     'DYe3ENQYByI',
  '312':     '8j7usw0EUrM',
  '311':     '3Col-scvX4U',
  '310':     '8HjhlzkpBsQ',
  '309':     '8XeBCZOSGoo',
  '308':     'OTIy1W6ObZU',
  '307':     'Js-hwI9xPes',
  '306':     'jfTKpem8Uxk',
  '305':     'TNzdAfci64g',
  '304':     'FAqCGQHkaXk',
  '303':     'EIOEBVP6AyI',
  '302':     'BtKxSd6VvhY',
  '301':     'Q49iHxPsUNM',
}

export const HERO_PHOTOS = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
  '/images/hero/hero-4.jpg',
  '/images/hero/hero-5.jpg',
  '/images/hero/hero-6.jpg',
  '/images/hero/hero-7.jpg',
  '/images/hero/hero-8.jpg',
  '/images/hero/hero-9.jpg',
  '/images/hero/hero-10.jpg',
  '/images/hero/hero-11.jpg',
  '/images/hero/hero-12.png',
  '/images/hero/hero-13.png',
  '/images/hero/hero-14.jpg',
  '/images/hero/hero-15.webp',
]

// Deterministic pre-shuffled order for the hero slideshow to avoid hydration mismatches
// during SSR / SSG while ensuring a beautiful, balanced visual progression.
export const SHUFFLED_HERO_PHOTOS = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-8.jpg',
  '/images/hero/hero-4.jpg',
  '/images/hero/hero-12.png',
  '/images/hero/hero-7.jpg',
  '/images/hero/hero-14.jpg',
  '/images/hero/hero-3.jpg',
  '/images/hero/hero-11.jpg',
  '/images/hero/hero-6.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-9.jpg',
  '/images/hero/hero-15.webp',
  '/images/hero/hero-5.jpg',
  '/images/hero/hero-10.jpg',
  '/images/hero/hero-13.png',
]

export const LOGO_SVG      = '/images/logo.svg'
export const LOGO_ICON     = '/images/logo-icon.png'
export const LOGO_ICON_SVG = '/images/logo-icon.svg'
export const LOGO_TEXT_SVG = '/images/logo-text.svg'
export const ABOUT_IMG = '/images/about.webp'

export const RESTAURANT_PHOTOS = [
  '/images/restaurant/padornelo-1.jpg',
  '/images/restaurant/padornelo-2.png',
  '/images/restaurant/padornelo-3.png',
  '/images/restaurant/padornelo-4.png',
]

export const YT_CHANNEL_ID = 'UCMzo7LwahJEbzbt1A5rtC5g'
export const YT_SHORTS_URL = 'https://www.youtube.com/@HostalSolZamora/shorts'

export const ROOM_TYPES: Record<string, string[]> = {
  'Balcon':     ['303', '310', '321'],
  '2 Camas':    ['301', '302', '304', '309', '311', '312'],
  'Matrimonio': ['305', '306', '307', '308', '322', '323', '324'],
}

export function useRooms() {
  const appConfig = useAppConfig()
  const roomImages = (appConfig.roomImages as Record<string, string[]>) || {}

  function photoUrl(path: string): string {
    return path
  }

  function roomPhotoPaths(room: string): string[] {
    if (room === 'All') {
      return Object.entries(roomImages)
        .filter(([key]) => key !== 'General' && key !== 'Entrada')
        .flatMap(([_, paths]) => paths)
    }
    if (ROOM_TYPES[room]) {
      return ROOM_TYPES[room].flatMap(r => roomImages[r] || [])
    }
    return roomImages[room] || []
  }

  const roomKeys = Object.keys(roomImages)
    .filter(k => k !== 'General')
    .sort((a, b) => {
      if (a === 'Entrada') return 1
      if (b === 'Entrada') return -1
      return a.localeCompare(b)
    })

  const typeKeys = Object.keys(ROOM_TYPES)

  return { photoUrl, roomPhotoPaths, roomKeys, typeKeys }
}

/** Extracts the room key ('301', 'Entrada', …) from a photo path. */
export function roomFromPath(path: string): string {
  const m = path.match(/\/images\/rooms\/([^/]+)\/[^/]+$/)
  return m ? m[1]! : 'Entrada'
}

/**
 * Descriptive, localised alt texts for room photos/videos, built only from
 * existing i18n strings (rooms.types[].label, rooms.entrance, rooms.mediaPhotos,
 * rooms.videoLabel) — e.g. "Doble de matrimonio 323 — Fotos 2/16".
 */
export function useRoomMediaAlts() {
  const { t, tm, rt } = useI18n()
  const { roomPhotoPaths, roomKeys } = useRooms()

  // room key → localised room-type label (via the type card photoPath)
  const roomTypeLabels = computed(() => {
    const map: Record<string, string> = {}
    for (const [typeKey, rooms] of Object.entries(ROOM_TYPES)) {
      const fallback = t(`rooms.filter${typeKey.replace(' ', '')}`)
      for (const r of rooms) map[r] = fallback
    }
    for (const type of ((tm('rooms.types') as any[]) || [])) {
      const room = roomFromPath(rt(type.photoPath))
      const typeKey = Object.keys(ROOM_TYPES).find(k => ROOM_TYPES[k]!.includes(room))
      if (!typeKey) continue
      const label = rt(type.label)
      for (const r of ROOM_TYPES[typeKey]!) map[r] = label
    }
    return map
  })

  function roomLabel(room: string): string {
    if (room === 'Entrada') return t('rooms.entrance')
    const typeLabel = roomTypeLabels.value[room]
    return typeLabel ? `${typeLabel} ${room}` : room
  }

  // path → alt, precomputed once per locale
  const photoAlts = computed(() => {
    const photos = t('rooms.mediaPhotos')
    const map: Record<string, string> = {}
    for (const room of roomKeys) {
      const paths = roomPhotoPaths(room)
      const label = roomLabel(room)
      paths.forEach((p, i) => {
        if (!map[p]) map[p] = `${label} — ${photos} ${i + 1}/${paths.length}`
      })
    }
    return map
  })

  function photoAlt(path: string): string {
    return photoAlts.value[path] || roomLabel(roomFromPath(path))
  }

  function videoAlt(room: string): string {
    return `${roomLabel(room)} — ${t('rooms.videoLabel')}`
  }

  return { roomLabel, photoAlt, videoAlt }
}

export const AMENITY_ICONS = [
  'tv',               // 0: TV
  'wifi',             // 1: WiFi
  'shower-head',      // 2: Bathroom
  'laptop',           // 3: Desk
  'thermometer',      // 4: Heating
  'droplets',         // 5: Amenities
  'bed',              // 6: Towels
  'wind',             // 7: Air Conditioning
  'zap',              // 8: Hair dryer
  'shirt',            // 9: Wardrobe
  'spray-can',        // 10: Cleaning
  'armchair',         // 11: Chair
  'cctv',             // 12: CCTV
  'arrow-up-down',    // 13: Elevator
]

export function getExtraIcon(label: string): string {
  const l = label.toLowerCase()
  if (l.includes('balcón') || l.includes('balcony')) return 'building'
  if (l.includes('cama')   || l.includes('bed'))     return 'bed'
  if (l.includes('tv'))                              return 'tv'
  if (l.includes('wifi'))                            return 'wifi'
  return 'check'
}
