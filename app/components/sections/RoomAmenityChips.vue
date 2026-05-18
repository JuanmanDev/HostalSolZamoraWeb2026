<template>
  <div class="rooms__amenities">
    <span v-for="a in items" :key="a.label" class="rooms__chip">
      <LucideIcon :name="a.icon" :size="12" color="var(--green)" />
      {{ a.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * Unified component for displaying amenity chips.
 * Accepts an array of { label: string, icon: string }.
 */
defineProps<{ 
  items: Array<{ label: string, icon: string }> 
}>()
</script>

<style scoped>
.rooms__amenities { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 6px; 
}
.rooms__chip { 
  display: inline-flex; 
  align-items: center; 
  gap: 6px;
  background: var(--green-light); 
  border-radius: 20px; 
  padding: 4px 11px; 
  font-size: 12.5px; 
  color: var(--dark-muted); 
}
</style>
