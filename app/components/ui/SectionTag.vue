<template>
  <span :class="['section-tag', { 'section-tag--light': light }]">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{ light?: boolean }>()
</script>
