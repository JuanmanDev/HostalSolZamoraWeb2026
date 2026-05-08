<template>
  <component :is="icon" :size="size" :color="color" :stroke-width="strokeWidth" />
</template>

<script setup lang="ts">
import {
  Globe, Menu, X, Tag, MapPin, Building2, PawPrint, Star,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  BedDouble, Building, BedSingle, LayoutGrid, Image, PlayCircle, Play,
  Tv, Tv2, ParkingSquare, Car, Info, Navigation, Landmark, Train,
  Plus, Minus, ShieldCheck, XCircle, Lock, Zap, CalendarCheck, CalendarClock,
  Phone, Smartphone, Mail, Clock, Key, LogOut, Moon, MessageCircle,
  Copy, Check, Footprints, UtensilsCrossed, ZoomIn,
  ShowerHead, Wifi, Armchair, Thermometer, Wind, Package, Bed, Trees,
  Warehouse, ImageOff, Youtube, ExternalLink,
  Luggage, UserCheck, AlertCircle, DoorOpen, IdCard, FileText,
  Laptop, FileBadge2, Search, FileCheck,
  BanknoteArrowDown,
  type LucideIcon,
} from 'lucide-vue-next'

const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation & layout
  'globe': Globe, 'menu': Menu, 'x': X, 'tag': Tag,
  'chevron-down': ChevronDown, 'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight,
  'layout-grid': LayoutGrid,

  // Location & transport
  'map-pin': MapPin, 'building-2': Building2, 'building': Building,
  'navigation': Navigation, 'landmark': Landmark, 'train': Train, 'car': Car,
  'parking-square': ParkingSquare, 'warehouse': Warehouse,

  // Accommodation
  'bed-double': BedDouble, 'bed-single': BedSingle, 'bed': Bed,
  'luggage': Luggage,

  // Room amenities
  'tv': Tv, 'tv-2': Tv2, 'wifi': Wifi, 'shower-head': ShowerHead,
  'armchair': Armchair, 'thermometer': Thermometer, 'wind': Wind,
  'package': Package, 'trees': Trees,

  // Media
  'image': Image, 'image-off': ImageOff, 'play-circle': PlayCircle, 'play': Play,
  'youtube': Youtube, 'zoom-in': ZoomIn,

  // Time & schedule
  'clock': Clock, 'calendar-check': CalendarCheck, 'calendar-clock': CalendarClock,

  // Contact & communication
  'phone': Phone, 'smartphone': Smartphone, 'mail': Mail,
  'message-circle': MessageCircle, 'search': Search,

  // Booking & payment
  'shield-check': ShieldCheck, 'x-circle': XCircle, 'lock': Lock,
  'zap': Zap, 'tag-icon': Tag,

  // User actions
  'key': Key, 'log-out': LogOut, 'user-check': UserCheck,
  'door-open': DoorOpen,

  // Status & UI
  'plus': Plus, 'minus': Minus, 'check': Check, 'copy': Copy,
  'info': Info, 'alert-circle': AlertCircle,
  'external-link': ExternalLink, 'footprints': Footprints,

  // Documents
  'id-card': IdCard, 'file-text': FileText, 'file-badge': FileBadge2,
  'file-check': FileCheck,

  // Misc
  'paw-print': PawPrint, 'star': Star, 'moon': Moon,
  'laptop': Laptop, 'utensils-crossed': UtensilsCrossed,
  'banknote-arrow-down': BanknoteArrowDown,
}

const props = defineProps<{
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}>()

const icon = computed(() => ICON_MAP[props.name] ?? X)
</script>
