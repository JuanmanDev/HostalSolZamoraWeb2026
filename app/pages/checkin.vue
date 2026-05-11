<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content container">
      <UiSectionTag>Check-in</UiSectionTag>
      <h1 class="page-heading">{{ t('pages.checkin.heading') }}</h1>
      <p class="page-lead">{{ t('pages.checkin.lead') }}</p>

      <!-- Before you arrive -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="clock" :size="22" color="var(--green)" />
          {{ t('pages.checkin.beforeTitle') }}
        </h2>
        <div class="ci-before-list">
          <div class="ci-before-item ci-before-item--alert">
            <LucideIcon name="alert-circle" :size="18" color="#c0392b" style="flex-shrink:0;margin-top:2px" />
            <span>{{ t('pages.checkin.beforeHours') }}</span>
          </div>
          <div class="ci-before-item">
            <LucideIcon name="user-check" :size="18" color="var(--green)" style="flex-shrink:0;margin-top:2px" />
            <span>
              {{ t('pages.checkin.beforeCheckin') }}
              
            </span>
          </div>
          <div class="ci-before-item">
            <LucideIcon name="luggage" :size="18" color="var(--green)" style="flex-shrink:0;margin-top:2px" />
            <span>{{ t('pages.checkin.beforeLuggage') }}</span>
          </div>
        </div>
      </section>

      <!-- Online check-in CTA -->
      <section class="ci-cta-block">
        <div class="ci-cta">
          <div class="ci-cta__text">
            <h2 class="ci-cta__title">
              <LucideIcon name="laptop" :size="20" color="var(--green)" />
              {{ t('pages.checkin.ctaTitle') }}
            </h2>
            <p class="ci-cta__desc">{{ t('pages.checkin.ctaDesc') }}</p>
          </div>
          <a href="https://guest.chekin.com/NpW1pWVoQ3CWVMB1augWwA-housing" target="_blank" class="ci-cta__btn">
            <LucideIcon name="calendar-check" :size="16" color="var(--green)" />
            {{ t('pages.checkin.ctaBtn') }}
          </a>
        </div>
      </section>

      <!-- Navigation apps -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="navigation" :size="22" color="var(--green)" />
          {{ t('pages.checkin.arrivalTitle') }}
        </h2>
        <div class="ci-nav-apps">
          <a
            v-for="app in navApps"
            :key="app.name"
            :href="app.href"
            target="_blank"
            rel="noopener noreferrer"
            class="ci-nav-btn"
            :style="{ background: app.color }"
          >
            <LucideIcon name="navigation" :size="14" color="#fff" />
            {{ app.name }}
          </a>
        </div>
      </section>

      <!-- Arrival steps -->
      <section class="ci-section">
        <div class="ci-steps">
          <div v-for="(step, i) in steps" :key="i" class="ci-step">
            <div class="ci-step__num">{{ i + 1 }}</div>
            <div class="ci-step__body">
              <div class="ci-step__title">{{ step.title }}</div>
              <div class="ci-step__desc">{{ step.desc }}</div>
              
              <NuxtLink v-if="step.link" :to="step.link" class="ci-step__link">
                {{ step.linkText }} →
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Map embed -->
      <section class="ci-section">
        <iframe
          src="https://maps.google.com/maps?q=Hostal+Sol,+Calle+Benavente,+2,+49014+Zamora+Espa%C3%B1a&output=embed&z=17"
          title="Hostal Sol Zamora"
          class="ci-map"
          loading="lazy"
        />
      </section>

      <!-- At reception -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="door-open" :size="22" color="var(--green)" />
          {{ t('pages.checkin.arrivalInfoTitle') }}
        </h2>
        <p class="ci-section-body">{{ t('pages.checkin.arrivalInfo') }}</p>
      </section>

      <!-- Room rules -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="bed-double" :size="22" color="var(--green)" />
          {{ t('pages.checkin.roomTitle') }}
        </h2>
        <p class="ci-section-body">{{ t('pages.checkin.roomInfo') }}</p>
      </section>

      <!-- Checkout -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="log-out" :size="22" color="var(--green)" />
          {{ t('pages.checkin.checkoutTitle') }}
        </h2>
        <p class="ci-section-body">{{ t('pages.checkin.checkoutInfo') }}</p>
      </section>

      <!-- Legal docs -->
      <section class="ci-section">
        <h2 class="ci-section-title">
          <LucideIcon name="file-badge" :size="22" color="var(--green)" />
          {{ t('pages.checkin.docsTitle') }}
        </h2>
        <p class="ci-section-intro">{{ t('pages.checkin.docsIntro') }}</p>

        <div class="ci-doc-unified">
          <div
            v-for="field in docFields"
            :key="field"
            class="ci-doc-unified__item"
          >
            <LucideIcon name="check" :size="13" color="var(--green)" />
            <span>{{ field }}</span>
          </div>
        </div>

        <div class="ci-ine-note">{{ t('pages.checkin.ineNote') }}</div>

        <a
          href="https://www.boe.es/boe/dias/2021/11/01/pdfs/BOE-A-2021-17808.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="ci-boe-link"
        >
          <LucideIcon name="external-link" :size="14" color="var(--green)" />
          {{ t('pages.checkin.docsBoe') }}
        </a>
      </section>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
import type { CheckinStep } from '~/types'
const { t, tm, rt } = useI18n()

useHead({
  title: computed(() => t('pages.checkin.title')),
  meta: [{ name: 'description', content: computed(() => t('pages.checkin.description')) as any }],
})

const docFields = computed(() =>
  (tm('pages.checkin.docFields') as any[]).map((f: any) => rt(f)) as string[]
)

const steps = computed(() =>
  (tm('pages.checkin.steps') as any[]).map((s: any) => ({
    title:    rt(s.title),
    desc:     rt(s.desc),
    link:     s.link ?? null,
    linkText: s.linkText ? rt(s.linkText) : null,
  })) as (CheckinStep & { link: string | null; linkText: string | null })[]
)

const navApps = [
  { name: 'Google Maps', color: '#4285f4', href: 'https://www.google.com/maps/dir//Hostal+Sol,+Calle+Benavente,+2,+3%C2%BA,+49014+Zamora,+Espa%C3%B1a/@41.5062474,-5.7435342,18z/' },
  { name: 'Apple Maps',  color: '#1c1c1e', href: 'https://maps.apple/p/5NVDS6BJpi3Ihy' },
  { name: 'Waze',        color: '#33ccff', href: 'https://www.waze.com/es/live-map/directions/es/cl/zamora/hostal-sol?navigate=yes&to=place.ChIJ72vc5TAeOQ0RRra7dNoyQyc' },
  { name: 'Bing Maps',   color: '#008373', href: 'https://www.bing.com/maps?q=Calle+Benavente+2+49014+Zamora&lvl=17' },
]
</script>

<style scoped>
.page-content { padding: 96px max(24px, 5vw) 80px; max-width: 1100px; margin: 0 auto; }

.page-heading {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 16px;
}
.page-lead {
  color: var(--dark-muted);
  font-size: 16px;
  line-height: 1.8;
  max-width: 680px;
  margin-bottom: 48px;
}

.ci-section { margin-bottom: 56px; }

.ci-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(1.3rem, 2.5vw, 1.9rem);
  font-weight: 500;
  color: var(--dark);
  margin-bottom: 20px;
}
.ci-section-intro { color: var(--dark-muted); font-size: 15px; line-height: 1.75; margin-bottom: 16px; }
.ci-section-body  { color: var(--dark-muted); font-size: 15px; line-height: 1.8; }

/* Before section */
.ci-before-list { display: flex; flex-direction: column; gap: 14px;  }
.ci-before-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--dark-muted);
}
.ci-before-item--alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.ci-link {
  color: var(--green);
  font-weight: 700;
  margin-left: 4px;
}

/* Nav apps */
.ci-nav-apps { display: flex; gap: 10px; flex-wrap: wrap; }
.ci-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}
.ci-nav-btn:hover { opacity: 0.85; }

/* Steps */
.ci-steps { display: flex; flex-direction: column; gap: 0; }
.ci-step {
  display: flex;
  gap: 20px;
  position: relative;
  padding-bottom: 32px;
}
.ci-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 42px;
  bottom: 0;
  width: 2px;
  background: var(--border);
}
.ci-step__num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}
.ci-step__title { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
.ci-step__desc  { color: var(--dark-muted); font-size: 14.5px; line-height: 1.75; }
.ci-step__link  { display: inline-block; margin-top: 8px; color: var(--green); font-weight: 600; font-size: 13.5px; }

.ci-map { width: 100%; height: 380px; border: none; border-radius: 12px; display: block; }

/* BOE link */
.ci-boe-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--green);
  font-weight: 600;
  font-size: 13.5px;
  margin-bottom: 20px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Unified doc card */
.ci-doc-unified {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px 24px;
  margin-bottom: 20px;
}
.ci-doc-unified__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13.5px;
  color: var(--dark-muted);
  line-height: 1.5;
}
.ci-doc-unified__item svg { flex-shrink: 0; margin-top: 2px; }

/* INE note */
.ci-ine-note {
  background: var(--green-light);
  border-left: 3px solid var(--green);
  border-radius: 8px;
  padding: 16px 18px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--dark-muted);
  margin-bottom: 20px;
  max-width: 760px;
}

/* CTA block */
.ci-cta-block { margin-bottom: 56px; }
.ci-cta {
  background: var(--green-light);
  border-radius: 16px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  border-left: 4px solid var(--green);
}
.ci-cta__title { font-size: clamp(1.2rem, 2vw, 1.7rem); font-weight: 700; color: var(--dark); margin: 0 0 8px; display: flex; align-items: center; gap: 8px; }
.ci-cta__desc  { color: var(--dark-muted); font-size: 15px; margin: 0; }
.ci-cta__text  { flex: 1; }
.ci-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: var(--green);
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.ci-cta__btn:hover { opacity: 0.85; }
</style>
