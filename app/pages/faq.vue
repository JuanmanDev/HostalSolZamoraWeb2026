<template>
  <div>
    <!-- Navbar -->
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <UiSectionTag>{{ t('nav.faq') }}</UiSectionTag>
      <h1 class="page-heading">{{ t('pages.faq.heading') }}</h1>
      <p class="page-lead">{{ t('pages.faq.lead') }}</p>

      
      <!-- Info grid -->
      <div class="faq-info-grid">
        <div v-for="tile in infoTiles" :key="tile.labelKey" class="faq-info-card">
          <LucideIcon :name="tile.icon" :size="22" color="var(--green)" />
          <div class="faq-info-card__label">{{ t(`contact.${tile.labelKey}`) }}</div>
          <div class="faq-info-card__val">{{ t(`contact.${tile.valKey}`) }}</div>
        </div>
      </div>


      <!-- Search -->
      <div class="faq-search">
        <LucideIcon name="zoom-in" :size="17" color="var(--dark-muted)" class="faq-search__icon" />
        <input
          v-model="query"
          type="search"
          :placeholder="t('pages.faq.searchPlaceholder')"
          class="faq-search__input"
        />
      </div>

      <!-- Results -->
      <div v-if="filteredItems.length === 0" class="faq-empty">
        {{ t('pages.faq.noResults') }}
      </div>

      <div v-else class="faq-list">
        <div v-for="(item, i) in filteredItems" :key="i" class="faq-item">
          <button class="faq-item__q" @click="open = open === i ? null : i">
            <span v-html="highlight(item.q)" />
            <LucideIcon :name="open === i ? 'minus' : 'plus'" :size="18" color="var(--green)" />
          </button>
          <Transition name="expand">
            <div v-if="open === i" class="faq-item__a">
              <p class="faq-item__a-text">{{ item.a }}</p>
              <div v-if="item.links?.length" class="faq-item__links">
                <NuxtLink
                  v-for="(link, li) in item.links"
                  :key="li"
                  :to="link.url"
                  class="faq-item__link"
                >
                  <LucideIcon v-if="link.icon" :name="link.icon" :size="14" />
                  {{ link.label }}
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contact buttons -->
      <div class="faq-contact-btns">
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
      </div>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
import type { FaqItem } from '~/types'
const { t, tm, rt } = useI18n()
const route = useRoute()

useSeo({
  title:       computed(() => t('pages.faq.title')),
  description: computed(() => t('pages.faq.description')),
  type:        'website',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.faq.title'),
  subtitle: t('pages.faq.description'),
})

const allItems = computed(() =>
  (tm('faq.items') as any[]).map((item: any) => ({
    q: rt(item.q),
    a: rt(item.a),
    tags: item.tags?.map((t: any) => rt(t)) as string[] | undefined,
    links: item.links?.map((l: any) => ({
      label: rt(l.label),
      url: rt(l.url),
      icon: rt(l.icon),
    })),
  })) as FaqItem[]
)
const query = ref((route.query.q as string) || '')
const open  = ref<number | null>(null)

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const filteredItems = computed(() => {
  if (!query.value.trim()) return allItems.value
  const q = normalize(query.value)
  return allItems.value.filter(item =>
    normalize(item.q).includes(q) ||
    normalize(item.a).includes(q) ||
    (item.tags?.some(tag => normalize(tag).includes(q)) ?? false)
  )
})

function highlight(text: string): string {
  if (!query.value.trim()) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="hl">$1</mark>')
}

const infoTiles = [
  { icon: 'key',        labelKey: 'checkin',   valKey: 'checkinVal' },
  { icon: 'log-out',    labelKey: 'checkout',  valKey: 'checkoutVal' },
  { icon: 'clock',      labelKey: 'attention', valKey: 'attentionVal' },
  { icon: 'moon',       labelKey: 'sunday',    valKey: 'sundayVal' },
  { icon: 'paw-print',  labelKey: 'pets',      valKey: 'petsVal' },
  { icon: 'building-2', labelKey: 'floor',     valKey: 'floorVal' },
]

// JSON-LD FAQPage — eligible for Google's FAQ rich result. Strip
// HTML/markdown from answers so the schema is plain text.
function plain(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\{'@'\}/g, '@')
    .replace(/\s+/g, ' ')
    .trim()
}

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allItems.value.map(item => ({
    '@type': 'Question',
    name: plain(item.q),
    acceptedAnswer: {
      '@type': 'Answer',
      text: plain(item.a),
    },
  })),
})
</script>

<style scoped>
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-heading {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 14px;
  max-width: 1000px;
}

.page-lead {
  color: var(--dark-muted);
  font-size: 16px;
  line-height: 1.75;
  max-width: 700px;
  margin-bottom: 40px;
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

.faq-empty { color: var(--dark-muted); font-size: 15px; margin-bottom: 40px; }

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
}
.faq-item__q {
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
.faq-item__q:hover { background: var(--green-light); }
.faq-item__a {
  padding: 0 20px 18px;
  color: var(--dark-muted);
  font-size: 14.5px;
  line-height: 1.75;
}
.faq-item__a-text { margin: 0 0 12px; }

.faq-item__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.faq-item__link {
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
.faq-item__link:hover {
  background: var(--green);
  color: #fff;
}

:global(.hl) {
  background: rgba(104,126,86,0.2);
  border-radius: 3px;
  padding: 0 2px;
}

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

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: opacity 0.2s, max-height 0.4s ease;
  max-height: 600px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
