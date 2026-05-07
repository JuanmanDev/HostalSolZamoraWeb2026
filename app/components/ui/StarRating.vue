<template>
  <span class="stars" :aria-label="`${count} estrellas`">{{ '★'.repeat(count) }}</span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ count?: number }>(), { count: 5 })
</script>

<style scoped>
.stars { color: var(--gold); letter-spacing: 1px; }
</style>
