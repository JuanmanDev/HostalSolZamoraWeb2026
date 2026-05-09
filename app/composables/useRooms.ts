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
  'images/hero/hero-1.jpg',
  'images/hero/hero-2.jpg',
  'images/hero/hero-3.jpg',
  'images/hero/hero-4.jpg',
  'images/hero/hero-5.jpg',
  'images/hero/hero-6.jpg',
  'images/hero/hero-7.jpg',
  'images/hero/hero-8.jpg',
  'images/hero/hero-9.jpg',
  'images/hero/hero-10.jpg',
  'images/hero/hero-11.jpg',
  'images/hero/hero-12.jpg',
  'images/hero/hero-13.jpg',
  'images/hero/hero-14.jpg',
  'images/hero/hero-15.webp',
]

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const SHUFFLED_HERO_PHOTOS = [...HERO_PHOTOS]
shuffleArray(SHUFFLED_HERO_PHOTOS)

export const LOGO_SVG  = 'images/logo.svg'
export const LOGO_ICON = 'images/logo-icon.png'
export const ABOUT_IMG = 'images/about.webp'

export const RESTAURANT_PHOTOS = [
  'images/restaurant/padornelo-1.jpg',
  'images/restaurant/padornelo-2.png',
  'images/restaurant/padornelo-3.png',
  'images/restaurant/padornelo-4.png',
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
