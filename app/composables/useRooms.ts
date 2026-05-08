export const ROOM_GROUPS: Record<string, number[]> = {
  '301': [2,3,4,5,6],
  '302': [7,8,9,10,11],
  '303': [12,13,14,15,16],
  '304': [17,18,19,20,21],
  '305': [22,23,24,25,26],
  '306': [27,28,29,30,31],
  '307': [32,33,34,35,36],
  '308': [37,38,39,40,41],
  '309': [42,43,44,45,46],
  '310': [47,48,49,50,51],
  '311': [52,53,54,55,56],
  '312': [57,58,59,60,61],
  '321': [62,63,64,65,66],
  '322': [67,68,69,70],
  '323': [72,73,74,75],
  '324': [76,77,78,79,80],
  'Entrada': [81,82,83,84,86,87,88,89,1],
}

const ALL_PHOTO_IDS = Object.values(ROOM_GROUPS).flat()

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
  '/images/hero/hero-12.jpg',
  '/images/hero/hero-13.jpg',
  '/images/hero/hero-14.jpg',
  '/images/hero/hero-15.webp',
]

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const SHUFFLED_HERO_PHOTOS = [...HERO_PHOTOS]
shuffleArray(SHUFFLED_HERO_PHOTOS)

export const LOGO_SVG  = '/images/logo.svg'
export const LOGO_ICON = '/images/logo-icon.png'
export const ABOUT_IMG = '/images/about.webp'

export const RESTAURANT_PHOTOS = [
  '/images/restaurant/padornelo-1.jpg',
  '/images/restaurant/padornelo-2.png',
  '/images/restaurant/padornelo-3.png',
  '/images/restaurant/padornelo-4.png',
]

export const YT_CHANNEL_ID = 'UCMzo7LwahJEbzbt1A5rtC5g'
export const YT_SHORTS_URL = 'https://www.youtube.com/@HostalSolZamora/shorts'

const PHOTO_DIMS: Record<number, string> = {
  1:'769x1024',2:'769x1024',3:'1024x769',4:'769x1024',5:'769x1024',6:'769x1024',
  7:'768x1024',8:'1024x769',9:'1024x769',10:'769x1024',11:'768x1024',
  12:'769x1024',13:'769x1024',14:'1024x769',15:'1024x769',16:'1024x768',
  17:'769x1024',18:'1024x769',19:'1024x769',20:'769x1024',21:'769x1024',
  22:'1024x768',23:'1024x769',24:'1024x769',25:'769x1024',26:'769x1024',
  27:'1024x769',28:'768x1024',29:'769x1024',30:'769x1024',31:'1024x769',
  32:'1024x769',33:'1024x768',34:'1024x769',35:'769x1024',36:'769x1024',
  37:'769x1024',38:'768x1024',39:'1024x768',40:'1024x768',41:'1024x769',
  42:'1024x769',43:'769x1024',44:'769x1024',45:'1024x768',46:'1024x769',
  47:'1024x769',48:'1024x769',49:'769x1024',50:'1024x768',51:'768x1024',
  52:'1024x769',53:'1024x769',54:'769x1024',55:'769x1024',56:'769x1024',
  57:'769x1024',58:'769x1024',59:'1024x768',60:'768x1024',61:'1024x769',
  62:'769x1024',63:'769x1024',64:'1024x768',65:'1024x769',66:'1024x769',
  67:'1024x769',68:'1024x769',69:'768x1024',70:'768x1024',
  72:'1024x768',73:'1024x769',74:'1024x769',75:'1024x769',
  76:'769x1024',77:'769x1024',78:'769x1024',79:'1024x769',80:'1024x769',
  81:'1024x769',82:'769x1024',83:'769x1024',84:'769x1024',
  86:'1024x768',87:'1024x768',88:'769x1024',89:'1024x769',90:'769x1024',
  91:'1024x769',92:'1024x768',93:'1024x769',94:'1024x769',95:'1024x769',
  96:'1024x769',97:'769x1024',
}

export function useRooms() {
  function photoUrl(n: number): string {
    return `/images/rooms/${n}.jpg`
  }

  function isPortrait(n: number): boolean {
    const dim = PHOTO_DIMS[n] ?? '1024x769'
    const [w = 1024, h = 769] = dim.split('x').map(Number)
    return h > w
  }

  function roomPhotoIds(room: string): number[] {
    return room === 'All' ? ALL_PHOTO_IDS : (ROOM_GROUPS[room] ?? [])
  }

  const roomKeys = Object.keys(ROOM_GROUPS)

  return { photoUrl, isPortrait, roomPhotoIds, roomKeys }
}
