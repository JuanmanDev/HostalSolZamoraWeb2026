<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <header id="about-hero" class="about-hero">
        <UiSectionTag>{{ t('pages.sobreNosotros.tag') }}</UiSectionTag>
        <h1 class="page-heading">{{ t('pages.sobreNosotros.heading') }}</h1>
        <p class="page-lead">{{ t('pages.sobreNosotros.intro1') }}</p>
        <p class="page-lead">{{ t('pages.sobreNosotros.intro2') }}</p>
        <p class="page-lead">{{ t('pages.sobreNosotros.intro3') }}</p>

        <div class="about-hero__ctas">
          <NuxtLink :to="localePath('reserva')" class="btn-primary">
            <LucideIcon name="calendar-check" :size="14" color="#fff" />
            {{ t('pages.sobreNosotros.ctaReserve') }}
          </NuxtLink>
          <NuxtLink :to="localePath('contacto')" class="btn-secondary">
            <LucideIcon name="mail" :size="14" color="var(--green)" />
            {{ t('pages.sobreNosotros.ctaContact') }}
          </NuxtLink>
        </div>
      </header>

      <!-- Photo banner -->
      <div id="about-photo" class="about-photo">
        <NuxtPicture
          src="/images/about.webp"
          alt="Hostal Sol Zamora"
          class="about-photo__img"
          width="1600"
          height="900"
          sizes="xs:100vw sm:100vw md:100vw lg:1200px"
        />
      </div>

      <!-- Philosophy -->
      <section id="about-philosophy" class="about-block">
        <UiSectionTag>{{ t('pages.sobreNosotros.philosophyTag') }}</UiSectionTag>
        <h2 class="block-heading">{{ t('pages.sobreNosotros.philosophyTitle') }}</h2>
        <p class="block-body">{{ t('pages.sobreNosotros.philosophyBody') }}</p>
      </section>

      <!-- Feel at home -->
      <section id="about-home" class="about-block about-block--alt">
        <UiSectionTag>{{ t('pages.sobreNosotros.homeTag') }}</UiSectionTag>
        <h2 class="block-heading">{{ t('pages.sobreNosotros.homeTitle') }}</h2>
        <p class="block-body">{{ t('pages.sobreNosotros.homeBody1') }}</p>
        <p class="block-body">{{ t('pages.sobreNosotros.homeBody2') }}</p>
      </section>

      <!-- Location -->
      <section id="about-location" class="about-block">
        <UiSectionTag>{{ t('pages.sobreNosotros.locationTag') }}</UiSectionTag>
        <h2 class="block-heading">{{ t('pages.sobreNosotros.locationTitle') }}</h2>
        <p class="block-body">{{ t('pages.sobreNosotros.locationBody') }}</p>
      </section>

      <!-- History -->
      <section id="about-history" class="about-block about-block--alt">
        <UiSectionTag>{{ t('pages.sobreNosotros.historyTag') }}</UiSectionTag>
        <h2 class="block-heading">{{ t('pages.sobreNosotros.historyTitle') }}</h2>
        <p class="block-body">{{ t('pages.sobreNosotros.historyBody1') }}</p>
        <p class="block-body">{{ t('pages.sobreNosotros.historyBody2') }}</p>
      </section>

      <!-- Bottom CTA -->
      <div id="about-bottom-cta" class="about-cta">
        <NuxtLink :to="localePath('reserva')" class="btn-primary btn-primary--lg">
          {{ t('pages.sobreNosotros.ctaReserve') }} →
        </NuxtLink>
      </div>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeo({
  title:       computed(() => t('pages.sobreNosotros.title')),
  description: computed(() => t('pages.sobreNosotros.description')),
  type:        'article',
  image:       '/images/about.webp',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.sobreNosotros.title'),
  subtitle: t('pages.sobreNosotros.description'),
})

// Breadcrumb so Google can render an "About" structured trail.
const cfg     = useRuntimeConfig()
const siteUrl = (cfg.public.siteUrl as string).replace(/\/$/, '')

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: t('nav.home'), item: `${siteUrl}/` },
    { '@type': 'ListItem', position: 2, name: t('nav.about'), item: `${siteUrl}${localePath('sobre-nosotros')}` },
  ],
})
</script>

<style scoped>
.page-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-heading {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
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

.about-hero__ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green);
  color: #fff;
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.85; }
.btn-primary--lg { padding: 16px 36px; font-size: 15px; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green-light);
  color: var(--green);
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #d8e0d0; }

.about-photo {
  margin: 56px 0;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.about-photo__img { width: 100%; height: 100%; }
.about-photo__img :deep(img) { width: 100%; height: 100%; object-fit: cover; }

.about-block {
  margin: 0 -32px;
  padding: 56px 32px;
  border-radius: 16px;
}
.about-block--alt { background: var(--green-light); }

.block-heading {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 500;
  color: var(--dark);
  margin: 8px 0 20px;
  line-height: 1.2;
}
.block-body {
  color: var(--dark-muted);
  font-size: 15.5px;
  line-height: 1.8;
  margin-bottom: 14px;
}
.block-body:last-child { margin-bottom: 0; }

.about-cta {
  text-align: center;
  margin-top: 56px;
}

@media (max-width: 700px) {
  .about-block { margin: 0 -16px; padding: 40px 20px; }
}
</style>
