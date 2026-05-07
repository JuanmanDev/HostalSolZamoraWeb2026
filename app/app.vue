<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

const RTL_LOCALES = ['ar', 'he', 'fa']
const isRtl = computed(() => RTL_LOCALES.includes(locale.value))
</script>
