<template>
  <div ref="root" class="lang">
    <button class="lang__trigger" @click="open = !open">
      <LucideIcon name="globe" :size="14" />
      {{ locale.toUpperCase() }}
    </button>

    <Transition name="fade-drop">
      <div v-if="open" class="lang__dropdown">
        <button
          v-for="loc in locales"
          :key="loc.code"
          :class="['lang__option', { 'lang__option--active': loc.code === locale }]"
          @click="select(loc.code)"
        >
          {{ loc.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function select(code: string) {
  setLocale(code as 'es' | 'en')
  open.value = false
}

onMounted(() => {
  const handler = (e: MouseEvent) => {
    if (root.value && !root.value.contains(e.target as Node)) open.value = false
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})
</script>

<style scoped>
.lang { position: relative; }

.lang__trigger {
  background: none;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.9);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: border-color 0.2s;
}

/* When navbar is solid, switch to dark colors */
:global(.navbar--solid) .lang__trigger {
  border-color: var(--border);
  color: var(--dark);
}

.lang__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 1000;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  min-width: 160px;
  max-height: 340px;
  overflow-y: auto;
  padding: 6px 0;
}

.lang__option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  color: var(--dark);
  font-weight: 400;
  transition: background 0.15s;
}
.lang__option:hover { background: var(--green-light); }
.lang__option--active { background: var(--green-light); color: var(--green); font-weight: 700; }

.fade-drop-enter-active, .fade-drop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-drop-enter-from, .fade-drop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
