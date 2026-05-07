<template>
  <div>
    <!-- Navbar -->
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <UiSectionTag>FAQ</UiSectionTag>
      <h1 class="page-heading">{{ t('pages.faq.heading') }}</h1>
      <p class="page-lead">{{ t('pages.faq.lead') }}</p>

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
            <div v-if="open === i" class="faq-item__a">{{ item.a }}</div>
          </Transition>
        </div>
      </div>

      <!-- Info grid -->
      <div class="faq-info-grid">
        <div v-for="tile in infoTiles" :key="tile.labelKey" class="faq-info-card">
          <LucideIcon :name="tile.icon" :size="22" color="var(--green)" />
          <div class="faq-info-card__label">{{ t(`contact.${tile.labelKey}`) }}</div>
          <div class="faq-info-card__val">{{ t(`contact.${tile.valKey}`) }}</div>
        </div>
      </div>

      <!-- Contact buttons -->
      <div class="faq-contact-btns">
        <a href="tel:+34980533152" class="faq-contact-btn">
          <LucideIcon name="phone" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">Llamar</div>
            <div class="faq-contact-btn__val">+34 980 533 152</div>
          </div>
        </a>
        <a href="https://wa.me/34639980253" target="_blank" rel="noopener noreferrer" class="faq-contact-btn faq-contact-btn--wa">
          <LucideIcon name="message-circle" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">WhatsApp</div>
            <div class="faq-contact-btn__val">+34 639 980 253</div>
          </div>
        </a>
        <a href="mailto:hostalsol@outlook.com" class="faq-contact-btn faq-contact-btn--email">
          <LucideIcon name="mail" :size="18" color="#fff" />
          <div>
            <div class="faq-contact-btn__label">Email</div>
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

useHead({
  title: computed(() => t('pages.faq.title')),
  meta: [{ name: 'description', content: computed(() => t('pages.faq.description')) as any }],
})

const allItems = computed(() =>
  (tm('faq.items') as any[]).map((item: any) => ({
    q: rt(item.q),
    a: rt(item.a),
  })) as FaqItem[]
)
const query = ref((route.query.q as string) || '')
const open  = ref<number | null>(null)

const filteredItems = computed(() => {
  if (!query.value.trim()) return allItems.value
  const q = query.value.toLowerCase()
  return allItems.value.filter(item =>
    item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
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
</script>

<style scoped>
.page-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-heading {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 14px;
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

.faq-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 48px; }

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

:global(.hl) {
  background: rgba(104,126,86,0.2);
  border-radius: 3px;
  padding: 0 2px;
}

.faq-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
  margin-top: 48px;
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
  transition: opacity 0.2s, max-height 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
