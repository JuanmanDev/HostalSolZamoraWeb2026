<template>
  <div class="faq-page">
    <LayoutTheNavbar :solid-from-start="true" />

    <div class="clover-decoration clover-decoration--left">
      <img src="/images/logo-clover.png" alt="" aria-hidden="true" />
    </div>
    <div class="clover-decoration clover-decoration--right">
      <img src="/images/logo-clover.png" alt="" aria-hidden="true" />
    </div>

    <main class="page-content">
      <section id="faq-intro">
        <NuxtLink :to="localePath('faq')" class="faq-back-link">
          <LucideIcon name="arrow-left" :size="16" />
          {{ t('nav.faq') }}
        </NuxtLink>
      </section>

      <!-- Main FAQ Item -->
      <section v-if="currentItem" class="faq-main-item">
        <h1 class="page-heading">{{ currentItem.q }}</h1>
        <div class="faq-main-item__a">
          <p class="page-lead">{{ currentItem.a }}</p>
          <div v-if="currentItem.links?.length" class="faq-item__links">
            <NuxtLink
              v-for="(link, li) in currentItem.links"
              :key="li"
              :to="link.url.startsWith('/') ? localePath(link.url.substring(1)) : link.url"
              class="faq-item__link"
            >
              <LucideIcon v-if="link.icon" :name="link.icon" :size="14" />
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Info grid -->
      <section id="faq-info" class="faq-info-grid">
        <div v-for="tile in infoTiles" :key="tile.labelKey" class="faq-info-card">
          <LucideIcon :name="tile.icon" :size="22" color="var(--green)" />
          <div class="faq-info-card__label">{{ t(`contact.${tile.labelKey}`) }}</div>
          <div class="faq-info-card__val">{{ t(`contact.${tile.valKey}`) }}</div>
        </div>
      </section>

      <!-- Search -->
      <section id="faq-search" class="faq-search">
        <LucideIcon name="zoom-in" :size="17" color="var(--dark-muted)" class="faq-search__icon" />
        <input
          v-model="query"
          type="search"
          :placeholder="t('pages.faq.searchPlaceholder')"
          class="faq-search__input"
          @keyup.enter="onSearchEnter"
        />
      </section>

      <!-- Other questions -->
      <section v-if="otherItems.length" id="faq-list" class="faq-list">
        <h3 class="faq-other-heading">Otras preguntas frecuentes</h3>
        <div 
          v-for="(item, i) in otherItems" 
          :key="i" 
          class="faq-item"
        >
          <NuxtLink :to="localePath('/faq/' + item.slug)" class="faq-item__q">
            <span>{{ item.q }}</span>
            <LucideIcon name="chevron-right" :size="18" color="var(--green)" />
          </NuxtLink>
        </div>
      </section>

      <!-- Contact buttons -->
      <section id="faq-contact" class="faq-contact-btns">
        <a href="tel:+34980533152" class="faq-contact-btn">
          <LucideIcon name="phone" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">{{ t('faq.callLabel') }}</div>
            <div class="faq-contact-btn__val">+34 980 533 152</div>
          </div>
        </a>
        <a href="https://wa.me/34639980253" target="_blank" rel="noopener noreferrer" class="faq-contact-btn faq-contact-btn--wa">
          <LucideIcon name="message-circle" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">{{ t('faq.waLabel') }}</div>
            <div class="faq-contact-btn__val">+34 639 980 253</div>
          </div>
        </a>
        <a href="mailto:hostalsol@outlook.com" class="faq-contact-btn faq-contact-btn--email">
          <LucideIcon name="mail" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">{{ t('faq.emailLabel') }}</div>
            <div class="faq-contact-btn__val">hostalsol@outlook.com</div>
          </div>
        </a>
      </section>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
import type { FaqItem } from '~/types'
import { slugify } from '~/utils/slugify'

const { t, tm, rt } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const allItems = computed(() =>
  (tm('faq.items') as any[]).map((item: any) => ({
    q: rt(item.q),
    a: rt(item.a),
    slug: slugify(rt(item.q)),
    tags: item.tags?.map((tag: any) => rt(tag)) as string[] | undefined,
    links: item.links?.map((l: any) => ({
      label: rt(l.label),
      url: rt(l.url),
      icon: rt(l.icon),
    })),
  })) as FaqItem[]
)

const currentSlug = computed(() => route.params.slug as string)

const currentItem = computed(() => {
  return allItems.value.find(item => item.slug === currentSlug.value) || allItems.value[0]
})

const otherItems = computed(() => {
  return allItems.value.filter(item => item.slug !== currentSlug.value)
})

const query = ref('')

function onSearchEnter() {
  if (query.value.trim()) {
    router.push({ path: localePath('faq'), query: { q: query.value.trim() } })
  }
}

// Redirect to /faq if the slug is completely invalid
if (!allItems.value.some(item => item.slug === currentSlug.value)) {
  if (process.server) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  } else {
    router.replace(localePath('faq'))
  }
}

useSeo({
  title:       computed(() => currentItem.value?.q || t('pages.faq.title')),
  description: computed(() => currentItem.value?.a.substring(0, 160) || t('pages.faq.description')),
  type:        'website',
})

defineOgImage('HostalSol', {
  title:    computed(() => currentItem.value?.q || t('ogImage.faq.title')),
  subtitle: computed(() => currentItem.value?.a.substring(0, 100) || t('pages.faq.description')),
})

// JSON-LD specific for THIS question
function plain(text: string): string {
  if (!text) return ''
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\{'@'\}/g, '@')
    .replace(/\s+/g, ' ')
    .trim()
}

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: currentItem.value ? [{
    '@type': 'Question',
    name: plain(currentItem.value.q),
    acceptedAnswer: {
      '@type': 'Answer',
      text: plain(currentItem.value.a),
    },
  }] : [],
})

const infoTiles = [
  { icon: 'key',        labelKey: 'checkin',   valKey: 'checkinVal' },
  { icon: 'log-out',    labelKey: 'checkout',  valKey: 'checkoutVal' },
  { icon: 'clock',      labelKey: 'attention', valKey: 'attentionVal' },
  { icon: 'moon',       labelKey: 'sunday',    valKey: 'sundayVal' },
  { icon: 'paw-print',  labelKey: 'pets',      valKey: 'petsVal' },
  { icon: 'building-2', labelKey: 'floor',     valKey: 'floorVal' },
]
</script>

<style scoped>
.faq-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.clover-decoration {
  position: fixed;
  z-index: -1;
  opacity: 0.1;
  pointer-events: none;
  filter: grayscale(0.5);
}
.clover-decoration img { width: 100%; height: auto; }
.clover-decoration--left { left: -75%; top: 20%; animation: float-slow-up 30s ease-in-out infinite alternate; }
.clover-decoration--right { right: -75%; bottom: 10%; animation: float-slow-down 35s ease-in-out infinite alternate; }

@keyframes float-slow-up {
  0% { transform: translateY(10%) rotate(-5deg); }
  100% { transform: translateY(-10%) rotate(5deg); }
}
@keyframes float-slow-down {
  0% { transform: translateY(-10%) rotate(5deg); }
  100% { transform: translateY(10%) rotate(-5deg); }
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
  position: relative;
}

.faq-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 32px;
  transition: opacity 0.2s;
}
.faq-back-link:hover { opacity: 0.8; }

.faq-main-item {
  margin-bottom: 48px;
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid var(--border);
}

.page-heading {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 600;
  line-height: 1.15;
  margin-bottom: 24px;
  color: var(--dark);
}

.page-lead {
  color: var(--dark-muted);
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 0;
}

.faq-item__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.faq-item__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--green-light);
  color: var(--green);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.faq-item__link:hover {
  background: var(--green);
  color: #fff;
}

.faq-other-heading {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--dark);
  font-weight: 600;
}

.faq-contact-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 48px;
  margin-bottom: 40px;
  max-width: 1000px;
}

.faq-contact-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--dark);
  color: #fff;
  border-radius: 12px;
  padding: 14px 20px;
  text-decoration: none;
  transition: opacity 0.2s;
  min-width: 200px;
}
.faq-contact-btn:hover { opacity: 0.85; }
.faq-contact-btn--wa { background: var(--whatsapp); }
.faq-contact-btn--email { background: #1565c0; }

.faq-contact-btn__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
}
.faq-contact-btn__val {
  font-size: 14px;
  font-weight: 700;
  margin-top: 2px;
}

@media (max-width: 800px) {
  .faq-contact-btn { width: 100%; }
  .faq-main-item { padding: 24px; }
}

.faq-search {
  position: relative;
  max-width: 600px;
  margin-bottom: 40px;
}
.faq-search__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.faq-search__input {
  width: 100%;
  padding: 14px 18px 14px 46px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-family: inherit;
  font-size: 15px;
  color: var(--dark);
  outline: none;
  transition: border-color 0.2s;
}
.faq-search__input:focus { border-color: var(--green); }

.faq-list { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  margin-bottom: 48px; 
  max-width: 1000px;
}

.faq-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
  border: 1px solid transparent;
}
.faq-item:hover {
  border-color: var(--green);
}

.faq-item__q {
  width: 100%;
  text-align: left;
  padding: 16px 20px;
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
  text-decoration: none;
  transition: background 0.15s;
}
.faq-item__q:hover { background: var(--green-light); }

.faq-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin: 48px 0 64px;
  width: 100%;
  max-width: 1275px;
}

@media (min-width: 1200px) {
  .faq-info-grid {
    width: min(1400px, 100vw - 2 * max(24px, 5vw));
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}

.faq-info-card {
  background: var(--green-light);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}
.faq-info-card__label {
  color: var(--dark-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 8px 0 4px;
}
.faq-info-card__val { color: var(--dark); font-weight: 700; font-size: 14px; }
</style>
