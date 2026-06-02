<template>
  <div>
    <LayoutTheNavbar :solid-from-start="isSolid" />
    <slot />
    <LayoutTheFooter />
  </div>
</template>

<script setup>
const route = useRoute()
const isSolid = computed(() => {
  return !(route.name && route.name.toString().startsWith('index'))
})
</script>
