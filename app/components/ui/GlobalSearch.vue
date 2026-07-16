<template>
  <div class="gsearch" ref="container">
    <button
      class="gsearch__trigger"
      :class="{ 'gsearch__trigger--dark': solid }"
      @click="open = !open"
      :aria-label="t('nav.search')"
      :title="`${t('nav.search')} (Ctrl+K)`"
    >
      <LucideIcon name="search" :size="17" :color="solid ? 'var(--dark)' : 'rgba(255,255,255,0.9)'" />
    </button>

    <Transition name="gsearch-drop">
      <div v-if="open" class="gsearch__panel" role="dialog" :aria-label="t('nav.search')">
        <div class="gsearch__input-wrap">
          <LucideIcon name="search" :size="15" color="var(--dark-muted)" class="gsearch__icon" />
          <input
            ref="inputEl"
            v-model="query"
            type="search"
            :placeholder="t('nav.searchPlaceholder')"
            class="gsearch__input"
            autocomplete="off"
            @keydown.escape="close"
            @keydown.down.prevent="moveDown"
            @keydown.up.prevent="moveUp"
            @keydown.enter.prevent="selectActive"
          />
          <kbd class="gsearch__esc">ESC</kbd>
          <button class="gsearch__close" @click="close" aria-label="Cerrar">
            <LucideIcon name="x" :size="14" color="var(--dark-muted)" />
          </button>
        </div>

        <div v-if="results.length" class="gsearch__results">
          <NuxtLink
            v-for="(r, i) in results"
            :key="r.route + r.title"
            :to="r.route"
            :class="['gsearch__result', { 'gsearch__result--active': i === activeIdx }]"
            @click="onSelectResult(r)"
            @mouseenter="activeIdx = i"
          >
            <span class="gsearch__result-cat">{{ r.category }}</span>
            <span class="gsearch__result-title">{{ r.title }}</span>
            <span class="gsearch__result-desc">{{ r.description }}</span>
          </NuxtLink>
        </div>

        <div v-else-if="query.length >= 2" class="gsearch__empty">
          {{ t('search.noResults') }} "<strong>{{ query }}</strong>"
        </div>

        <div v-else class="gsearch__hint">
          {{ t('nav.searchPlaceholder') }}
        </div>

        <div v-if="query.length >= 2" class="gsearch__footer">
          <NuxtLink :to="`/faq?q=${encodeURIComponent(query)}`" class="gsearch__allfaq" @click="onClickSearchInFaq">
            {{ t('search.searchInFaq') }} →
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch'

const props = defineProps<{ solid?: boolean }>()
const { t } = useI18n()
const { search } = useSearch()

const open      = ref(false)
const query     = ref('')
const activeIdx = ref(0)
const container = ref<HTMLElement | null>(null)
const inputEl   = ref<HTMLInputElement | null>(null)

const results = computed(() => search(query.value))

let searchDebounceTimer: any = null

watch(query, (newQuery) => {
  activeIdx.value = 0
  
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  
  if (newQuery.trim().length >= 2) {
    searchDebounceTimer = setTimeout(() => {
      try {
        const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
        umami.track('global-search', {
          query: newQuery.trim(),
          resultsCount: results.value.length,
          path: window.location.pathname
        })
      } catch (e) {
        console.warn('Umami not initialized:', e)
      }
    }, 1500)
  }
})

watch(open, (v) => {
  if (v) {
    nextTick(() => inputEl.value?.focus())
    query.value  = ''
    activeIdx.value = 0
  }
})

function close() {
  open.value  = false
  query.value = ''
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
}

function moveDown() {
  if (results.value.length) activeIdx.value = (activeIdx.value + 1) % results.value.length
}

function moveUp() {
  if (results.value.length) activeIdx.value = (activeIdx.value - 1 + results.value.length) % results.value.length
}

function selectActive() {
  const r = results.value[activeIdx.value]
  if (!r) return
  
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('global-search-select', {
      query: query.value.trim(),
      selectedTitle: r.title,
      selectedRoute: r.route,
      category: r.category,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }

  navigateTo(r.route)
  close()
}

function onSelectResult(r: any) {
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('global-search-select', {
      query: query.value.trim(),
      selectedTitle: r.title,
      selectedRoute: r.route,
      category: r.category,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
  close()
}

function onClickSearchInFaq() {
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('global-search-to-faq', {
      query: query.value.trim(),
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
  close()
}

onMounted(() => {
  const onClickOutside = (e: MouseEvent) => {
    if (container.value && !container.value.contains(e.target as Node)) close()
  }
  const onGlobalKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open.value = !open.value
    }
  }
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onGlobalKey)
  onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onGlobalKey)
  })
})
</script>

<style scoped>
.gsearch {
  position: relative;
}

.gsearch__trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.gsearch__trigger:hover { background: rgba(255,255,255,0.1); }
.gsearch__trigger--dark:hover { background: var(--green-light); }

.gsearch__panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 420px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.14);
  border: 1px solid var(--border);
  overflow: hidden;
  z-index: 1000;
}

@media (max-width: 480px) {
  .gsearch__panel {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0 0 14px 14px;
  }
}

.gsearch__input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.gsearch__icon { flex-shrink: 0; }

.gsearch__input {
  flex: 1;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: var(--dark);
  background: none;
  min-width: 0;
}
.gsearch__input::placeholder { color: var(--dark-muted); }

.gsearch__esc {
  font-size: 10px;
  color: var(--dark-muted);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 5px;
  font-family: inherit;
  flex-shrink: 0;
  cursor: default;
  user-select: none;
}

.gsearch__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}

.gsearch__results {
  max-height: 380px;
  overflow-y: auto;
}

.gsearch__result {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 8px;
  row-gap: 1px;
  padding: 10px 14px;
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
  cursor: pointer;
}
.gsearch__result:last-child { border-bottom: none; }
.gsearch__result:hover,
.gsearch__result--active { background: var(--green-light); }

.gsearch__result-cat {
  grid-column: 1;
  grid-row: 1;
  font-size: 10px;
  font-weight: 700;
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  align-self: center;
  white-space: nowrap;
}

.gsearch__result-title {
  grid-column: 2;
  grid-row: 1;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--dark);
}

.gsearch__result-desc {
  grid-column: 1 / -1;
  grid-row: 2;
  font-size: 12px;
  color: var(--dark-muted);
  line-height: 1.4;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.gsearch__empty,
.gsearch__hint {
  padding: 16px 14px;
  font-size: 13.5px;
  color: var(--dark-muted);
}

.gsearch__footer {
  border-top: 1px solid var(--border);
  padding: 10px 14px;
}

.gsearch__allfaq {
  font-size: 12px;
  font-weight: 600;
  color: var(--green);
  text-decoration: none;
}
.gsearch__allfaq:hover { text-decoration: underline; }

/* Transition */
.gsearch-drop-enter-active,
.gsearch-drop-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}
.gsearch-drop-enter-from,
.gsearch-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
