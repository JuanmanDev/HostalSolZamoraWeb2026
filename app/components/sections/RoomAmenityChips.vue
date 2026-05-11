<template>
  <div class="rooms__amenities">
    <span v-for="a in items" :key="a" class="rooms__chip">
      <LucideIcon :name="amenityIcon(a)" :size="12" color="var(--green)" />
      {{ a }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()

const AMENITY_ICONS: Record<string, string> = {
  // Tech
  'TV': 'tv', 'TV Superior': 'tv',
  'WiFi': 'wifi', 'Wifi': 'wifi',
  // Bathroom & toiletries
  'Baño privado': 'shower-head', 'Private bathroom': 'shower-head',
  'Amenities': 'droplets', 'Toiletries': 'droplets',
  'Secador de pelo (bajo petición)': 'zap',
  // Work
  'Escritorio': 'laptop', 'Desk': 'laptop',
  // Climate
  'Calefacción central': 'thermometer', 'Central heating': 'thermometer',
  'Aire acondicionado': 'wind', 'Air conditioning': 'wind',
  // Linens
  'Toallas y ropa de cama': 'bed', 'Towels & bed linen': 'bed', 'Towels & linen': 'bed',
  // Outdoor
  'Balcón privado': 'trees', 'Private balcony': 'trees',
  // Furniture
  'Armario': 'shirt', 'Silla': 'armchair',
  // Services
  'Limpieza diaria': 'spray-can',
  // Security & building
  'Cámaras de seguridad en zonas comunes': 'cctv',
  'Ascensor': 'arrow-up-down',
  // Bed types (room extras)
  '2 camas de 90cm de ancho': 'bed-single', '2 beds (90cm wide)': 'bed-single',
  '1 Cama de 135cm de ancho': 'bed-double', '1 bed (135cm wide)': 'bed-double',
}

function amenityIcon(name: string): string {
  return AMENITY_ICONS[name] ?? 'check'
}
</script>

<style scoped>
.rooms__amenities { display: flex; flex-wrap: wrap; gap: 6px; }
.rooms__chip { background: var(--green-light); border-radius: 20px; padding: 4px 11px; font-size: 12.5px; color: var(--dark-muted); }
</style>
