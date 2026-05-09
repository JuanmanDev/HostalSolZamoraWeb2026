<template>
  <div class="rooms__amenities">
    <span v-for="a in translatedItems" :key="a" class="rooms__chip">
      <LucideIcon :name="amenityIcon(a)" :size="12" color="var(--green)" />
      {{ a }}
    </span>
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()

const props = defineProps<{
  baseKey?: string
  items?: string[]
}>()

const translatedItems = computed(() => {
  if (props.items) {
    return props.items.map((a) => rt(a))
  }
  if (props.baseKey) {
    return (tm(props.baseKey) as any[]).map((a: any) => rt(a)) as string[]
  }
  return []
})

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
</script>

<style scoped>
.rooms__amenities { display: flex; flex-wrap: wrap; gap: 6px; }
.rooms__chip { background: var(--green-light); border-radius: 20px; padding: 4px 11px; font-size: 12.5px; color: var(--dark-muted); }
</style>
