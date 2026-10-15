<template>
  <!-- Deal-breaker policies, shown next to booking CTAs so guests see them
       before paying (they otherwise live deep in the FAQ). -->
  <aside class="key-facts" :aria-label="t('keyFacts.title')">
    <p class="key-facts__title">{{ t('keyFacts.title') }}</p>
    <ul class="key-facts__list">
      <li v-for="(fact, i) in facts" :key="i" class="key-facts__item">
        <LucideIcon :name="fact.icon" :size="16" color="var(--green)" />
        <span>{{ fact.text }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()

const facts = computed(() =>
  (tm('keyFacts.items') as any[]).map((f: any) => ({
    icon: rt(f.icon),
    text: rt(f.text),
  }))
)
</script>

<style scoped>
.key-facts {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 20px;
  margin: 24px auto 0;
  max-width: 760px;
  text-align: left;
}

.key-facts__title {
  font-weight: 700;
  font-size: 14px;
  color: var(--dark);
  margin: 0 0 12px;
}

.key-facts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 20px;
}

.key-facts__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--dark-muted);
}

.key-facts__item :deep(svg) {
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .key-facts__list { grid-template-columns: 1fr; }
}
</style>
