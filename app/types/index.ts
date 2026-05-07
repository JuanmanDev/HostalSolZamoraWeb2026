export interface ParkingOption {
  name: string
  dist: string
  price: string
  link: string
  tip: string
}

export interface Review {
  name: string
  text: string
  stars: number
}

export interface FaqItem {
  q: string
  a: string
}

export interface RoomType {
  label: string
  icon: string
  photoId: number
  extras: string[]
}

export interface NavApp {
  name: string
  color: string
  href: string
  icon?: string
  customSvg?: boolean
}

export interface CheckinStep {
  title: string
  desc: string
}

export interface DocType {
  name: string
  fields: string[]
}
