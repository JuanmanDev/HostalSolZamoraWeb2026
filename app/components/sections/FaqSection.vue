<template>
  <section id="faq" class="faq section-padding">
    <div class="container-sm">
      <UiSectionTag>{{ t('faq.title') }}</UiSectionTag>
      <div class="faq__header">
        <h2 class="faq__heading">{{ t('faq.title') }}</h2>
        <NuxtLink :to="localePath('faq')" class="faq__view-all">{{ t('faq.viewAll') }}</NuxtLink>
      </div>

      <div class="faq__list">
        <div 
          v-for="(item, i) in previewItems" 
          :key="i" 
          class="faq__item"
          :style="item.slug ? `view-transition-name: faq-item-${item.slug}` : ''"
        >
          <button class="faq__question" @click="toggle(i)">
            <span :style="item.slug ? `view-transition-name: faq-q-${item.slug}` : ''">{{ item.q }}</span>
            <LucideIcon :name="open === i ? 'minus' : 'plus'" :size="18" color="var(--green)" />
          </button>
          <Transition name="expand">
            <div v-if="open === i" class="faq__answer">
              <p class="faq__a-text">{{ item.a }}</p>
              <div v-if="item.links?.length || item.slug" class="faq__links">
                <NuxtLink
                  v-if="item.slug"
                  :to="localePath('/faq/' + item.slug)"
                  class="faq__link faq__link--subpage"
                >
                  <LucideIcon name="link" :size="14" />
                  Enlace directo
                </NuxtLink>
                <NuxtLink
                  v-for="(link, li) in item.links"
                  :key="li"
                  :to="link.url.startsWith('/') ? localePath(link.url.substring(1)) : link.url"
                  class="faq__link"
                >
                  <LucideIcon v-if="link.icon" :name="link.icon" :size="14" />
                  {{ link.label }}
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="faq__cta">
        <NuxtLink :to="localePath('faq')" class="btn btn-primary">
          {{ t('faq.viewAllBtn') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FaqItem } from '~/types'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const allItems = computed(() =>
  (tm('faq.items') as any[]).map((item: any) => ({
    q: rt(item.q),
    a: rt(item.a),
    slug: item.slug ? rt(item.slug) : undefined,
    links: item.links ? item.links.map((l: any) => ({
      label: rt(l.label),
      url: rt(l.url),
      icon: l.icon ? rt(l.icon) : undefined
    })) : undefined
  })) as FaqItem[]
)
const previewItems = computed(() => allItems.value.slice(0, 6))

const open = ref<number | null>(null)

function toggle(i: number) {
  const isOpening = open.value !== i
  open.value = isOpening ? i : null

  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    const item = previewItems.value[i]
    if (item) {
      umami.track('faq-toggle', {
        question: item.q,
        index: i,
        action: isOpening ? 'open' : 'close',
        location: 'home_preview',
        path: window.location.pathname
      })
    }
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }
}
</script>

<style scoped>
.faq { background: var(--green-light); }

.faq__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.faq__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: var(--dark);
  margin: 0;
}

.faq__view-all { color: var(--green); font-weight: 600; font-size: 14px; }

.faq__list { display: flex; flex-direction: column; gap: 8px; }

.faq__item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.faq__question {
  width: 100%;
  text-align: left;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--dark);
  transition: background 0.15s;
}
.faq__question:hover { background: var(--green-light); }

.faq__answer {
  padding: 0 20px 18px;
  color: var(--dark-muted);
  font-size: 14.5px;
  line-height: 1.75;
}
.faq__a-text { margin: 0 0 12px; }

.faq__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.faq__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--green-light);
  color: var(--green);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.faq__link:hover {
  background: var(--green);
  color: #fff;
}
.faq__link--subpage {
  background: #f1f5f9;
  color: var(--dark-muted);
}
.faq__link--subpage:hover {
  background: #e2e8f0;
  color: var(--dark);
}

.faq__cta { text-align: center; margin-top: 24px; }

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: opacity 0.2s, max-height 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
