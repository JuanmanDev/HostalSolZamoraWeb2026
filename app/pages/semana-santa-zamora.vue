<template>
  <div>
    <GuideArticle prefix="pages.semanaSanta" secondary-route="parking" />
  </div>
</template>

<script setup lang="ts">
// Spanish and English only: the copy is written for these two audiences and
// machine-translated duplicates in 19 more locales would be thin content.
defineI18nRoute({ locales: ['es', 'en'] })

const { t } = useI18n()
const localePath = useLocalePath()

useSeo({
  title:       computed(() => t('pages.semanaSanta.title')),
  description: computed(() => t('pages.semanaSanta.description')),
  type:        'article',
  image:       '/images/hero/hero-1.jpg',
})

defineOgImage('HostalSol', {
  title:    t('pages.semanaSanta.heading'),
  subtitle: t('common.priceFrom'),
})

const cfg     = useRuntimeConfig()
const siteUrl = (cfg.public.siteUrl as string).replace(/\/$/, '')

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: t('nav.home'), item: `${siteUrl}${localePath('index')}` },
    { '@type': 'ListItem', position: 2, name: t('nav.semanaSanta'), item: `${siteUrl}${localePath('semana-santa-zamora')}` },
  ],
})
</script>
