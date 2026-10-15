<template>
  <main class="page-content">
    <header class="guide-hero">
      <UiSectionTag>{{ t(`${prefix}.tag`) }}</UiSectionTag>
      <h1 class="page-heading">{{ t(`${prefix}.heading`) }}</h1>
      <p class="page-lead">{{ t(`${prefix}.lead`) }}</p>
      <p class="guide-price">
        <LucideIcon name="tag" :size="15" color="var(--green)" />
        {{ t('common.priceFrom') }}
      </p>
    </header>

    <section v-for="(section, i) in sections" :key="i" class="guide-block" :class="{ 'guide-block--alt': i % 2 === 1 }">
      <h2 class="block-heading">{{ section.title }}</h2>
      <p class="block-body">{{ section.body }}</p>
    </section>

    <UiKeyFacts />

    <div class="guide-cta">
      <h2 class="guide-cta__title">{{ t(`${prefix}.ctaTitle`) }}</h2>
      <p class="guide-cta__body">{{ t(`${prefix}.ctaBody`) }}</p>
      <div class="guide-cta__btns">
        <NuxtLink :to="localePath('reserva')" class="btn-primary">
          <LucideIcon name="calendar-check" :size="14" color="#fff" />
          {{ t('nav.reserve') }}
        </NuxtLink>
        <NuxtLink :to="localePath(secondaryRoute)" class="btn-secondary">
          <LucideIcon name="car" :size="14" color="var(--green)" />
          {{ t(`${prefix}.ctaParking`) }}
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** i18n key prefix, e.g. 'pages.semanaSanta' */
  prefix: string
  /** Route name for the secondary button */
  secondaryRoute: string
}>()

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const sections = computed(() =>
  (tm(`${props.prefix}.sections`) as any[]).map((s: any) => ({
    title: rt(s.title),
    body:  rt(s.body),
  }))
)
</script>

<style scoped>
.page-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-heading {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 500;
  line-height: 1.1;
  margin: 8px 0 24px;
}

.page-lead {
  color: var(--dark-muted);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 18px;
}

.guide-price {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green-light);
  color: var(--dark);
  font-weight: 700;
  font-size: 14px;
  border-radius: 30px;
  padding: 8px 16px;
  margin: 0 0 32px;
}

.guide-block {
  padding: 28px 0;
  border-top: 1px solid var(--border);
}

.block-heading {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin: 0 0 12px;
}

.block-body {
  color: var(--dark-muted);
  font-size: 15.5px;
  line-height: 1.8;
  margin: 0;
}

.guide-cta {
  text-align: center;
  margin-top: 48px;
}

.guide-cta__title {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  margin: 0 0 8px;
}

.guide-cta__body {
  color: var(--dark-muted);
  margin: 0 0 20px;
}

.guide-cta__btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
}

.btn-primary { background: var(--green); color: #fff; }
.btn-secondary { border: 1.5px solid var(--green); color: var(--green); background: #fff; }
</style>
