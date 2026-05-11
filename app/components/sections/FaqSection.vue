<template>
  <section id="faq" class="faq section-padding">
    <div class="container-sm">
      <UiSectionTag>{{ t('faq.title') }}</UiSectionTag>
      <div class="faq__header">
        <h2 class="faq__heading">{{ t('faq.title') }}</h2>
        <NuxtLink :to="localePath('faq')" class="faq__view-all">{{ t('faq.viewAll') }}</NuxtLink>
      </div>

      <div class="faq__list">
        <div v-for="(item, i) in previewItems" :key="i" class="faq__item">
          <button class="faq__question" @click="open = open === i ? null : i">
            <span>{{ item.q }}</span>
            <LucideIcon :name="open === i ? 'minus' : 'plus'" :size="18" color="var(--green)" />
          </button>
          <Transition name="expand">
            <div v-if="open === i" class="faq__answer">{{ item.a }}</div>
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
  })) as FaqItem[]
)
const previewItems = computed(() => allItems.value.slice(0, 6))

const open = ref<number | null>(null)
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

.faq__cta { text-align: center; margin-top: 24px; }

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: opacity 0.2s, max-height 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
