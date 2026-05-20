<template>
  <button class="copy-btn" :title="copied ? 'Copiado' : 'Copiar'" @click="copy">
    <LucideIcon :name="copied ? 'check' : 'copy'" :size="14" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
    
    try {
      const umami = useUmami()
      umami.track('info-copy', {
        text: props.text,
        path: window.location.pathname
      })
    } catch (e) {
      console.warn('Umami not initialized:', e)
    }
  } catch {}
}
</script>

<style scoped>
.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  color: rgba(255,255,255,0.4);
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
}
.copy-btn:hover { color: rgba(255,255,255,0.8); }
</style>
