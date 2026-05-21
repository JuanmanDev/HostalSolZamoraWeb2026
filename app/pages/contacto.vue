<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <section id="contact-intro">
        <UiSectionTag>{{ t('pages.contacto.tag') }}</UiSectionTag>
        <h1 class="page-heading">{{ t('pages.contacto.heading') }}</h1>
        <p class="page-lead">{{ t('pages.contacto.lead') }}</p>
      </section>

      <div class="contact-grid">
        <!-- Left: contact info + form -->
        <div>
          <!-- Quick action buttons -->
          <section id="contact-quick-actions" class="quick-actions">
            <a href="tel:+34980533152" class="quick-btn">
              <LucideIcon name="phone" :size="18" color="#fff" />
              <div>
                <div class="quick-btn__label">{{ t('faq.callLabel') }}</div>
                <div class="quick-btn__val">+34 980 533 152</div>
              </div>
            </a>
            <a href="https://wa.me/34639980253" target="_blank" rel="noopener noreferrer" class="quick-btn quick-btn--wa">
              <LucideIcon name="message-circle" :size="18" color="#fff" />
              <div>
                <div class="quick-btn__label">{{ t('pages.contacto.whatsappLabel') }}</div>
                <div class="quick-btn__val">+34 639 980 253</div>
              </div>
            </a>
            <a href="mailto:hostalsol@outlook.com" class="quick-btn quick-btn--email">
              <LucideIcon name="mail" :size="18" color="#fff" />
              <div>
                <div class="quick-btn__label">{{ t('pages.contacto.emailLabel') }}</div>
                <div class="quick-btn__val">hostalsol@outlook.com</div>
              </div>
            </a>
          </section>

          <!-- Info card -->
          <section id="contact-info" class="info-card">
            <h2 class="block-heading">{{ t('pages.contacto.infoTitle') }}</h2>

            <div class="info-row">
              <LucideIcon name="map-pin" :size="18" color="var(--green)" />
              <div>
                <div class="info-row__label">{{ t('pages.contacto.addressLabel') }}</div>
                <div class="info-row__val">{{ t('pages.contacto.addressVal') }}</div>
              </div>
            </div>

            <div class="info-row">
              <LucideIcon name="clock" :size="18" color="var(--green)" />
              <div>
                <div class="info-row__label">{{ t('pages.contacto.hoursLabel') }}</div>
                <div class="info-row__val">
                  <strong>{{ t('pages.contacto.hoursReceptionLabel') }}:</strong> {{ t('pages.contacto.hoursReceptionVal') }}<br />
                  <strong>{{ t('pages.contacto.hoursPhoneLabel') }}:</strong> {{ t('pages.contacto.hoursPhoneVal') }}
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir//Hostal+Sol,+Calle+Benavente,+2,+3%C2%BA,+49014+Zamora,+Espa%C3%B1a/@41.5062474,-5.7435342,18z/"
              target="_blank"
              rel="noopener noreferrer"
              class="map-link"
            >
              <LucideIcon name="navigation" :size="14" color="var(--green)" />
              {{ t('pages.contacto.mapBtn') }}
            </a>
          </section>

          <!-- Contact form (mailto-based, no backend required for static export) -->
          <section id="contact-form" class="form-card">
            <h2 class="block-heading">{{ t('pages.contacto.formTitle') }}</h2>
            <p class="form-intro">{{ t('pages.contacto.formIntro') }}</p>

            <form class="contact-form" @submit.prevent="onSubmit">
              <label class="form-field">
                <span class="form-label">{{ t('pages.contacto.fName') }}</span>
                <input v-model="form.name" type="text" required autocomplete="name" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ t('pages.contacto.fEmail') }}</span>
                <input v-model="form.email" type="email" required autocomplete="email" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ t('pages.contacto.fSubject') }}</span>
                <input v-model="form.subject" type="text" required />
              </label>
              <label class="form-field">
                <span class="form-label">{{ t('pages.contacto.fMessage') }}</span>
                <textarea v-model="form.message" rows="6" required></textarea>
              </label>
              <label class="form-check">
                <input v-model="form.accept" type="checkbox" required />
                <span>
                  {{ t('pages.contacto.fAccept') }}
                  <NuxtLink :to="localePath('terminos-y-condiciones')">{{ t('pages.contacto.fAcceptLink') }}</NuxtLink>.
                </span>
              </label>

              <button class="form-submit" type="submit">
                <LucideIcon name="send" :size="14" color="#fff" />
                {{ t('pages.contacto.fSend') }}
              </button>

              <p v-if="sent" class="form-sent">{{ t('pages.contacto.fSent') }}</p>
            </form>
          </section>
        </div>

        <!-- Right: distances + map + parking link -->
        <aside class="side-panel">
          <section id="contact-distances" class="distances-card">
            <h2 class="block-heading">{{ t('pages.contacto.distancesTitle') }}</h2>
            <ul class="distances-list">
              <li v-for="d in distances" :key="d.name">
                <LucideIcon name="footprints" :size="14" color="var(--green)" />
                <span class="distances-list__name">{{ d.name }}</span>
                <span class="distances-list__val">{{ d.value }}</span>
              </li>
            </ul>
          </section>

          <iframe
            id="contact-map"
            src="https://maps.google.com/maps?q=Hostal+Sol,+Calle+Benavente,+2,+49014+Zamora+Espa%C3%B1a&output=embed&z=17"
            title="Hostal Sol Zamora"
            class="contact-map"
            loading="lazy"
          />

          <section id="contact-parking" class="parking-note">
            <LucideIcon name="car" :size="18" color="var(--green)" />
            <div>
              <p>{{ t('pages.contacto.parkingNote') }}</p>
              <NuxtLink :to="localePath('parking')" class="parking-link">{{ t('pages.contacto.parkingLink') }}</NuxtLink>
            </div>
          </section>
        </aside>
      </div>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath    = useLocalePath()

useSeo({
  title:       computed(() => t('pages.contacto.title')),
  description: computed(() => t('pages.contacto.description')),
  type:        'website',
})

defineOgImage('HostalSol', {
  title:    t('ogImage.contacto.title'),
  subtitle: t('pages.contacto.description'),
})

const cfg     = useRuntimeConfig()
const siteUrl = (cfg.public.siteUrl as string).replace(/\/$/, '')

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('nav.home'),    item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: t('nav.contact'), item: `${siteUrl}${localePath('contacto')}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto — Hostal Sol Zamora',
    url: `${siteUrl}/contacto`,
    mainEntity: {
      '@type': 'LodgingBusiness',
      '@id': `${siteUrl}/#lodging`,
    },
  },
])

const distances = computed(() =>
  (tm('pages.contacto.distances') as any[]).map((d: any) => ({
    name:  rt(d.name),
    value: rt(d.value),
  }))
)

const form = reactive({
  name:    '',
  email:   '',
  subject: '',
  message: '',
  accept:  false,
})
const sent = ref(false)

// Mailto fallback — works in static deployments without a backend.
// For a future server-backed contact form, swap this for a POST to
// /api/contact (Nitro server route).
function onSubmit() {
  try {
    const umami = { track: typeof umTrackEvent !== 'undefined' ? umTrackEvent : () => {} }
    umami.track('contact-form-submit', {
      subject: form.subject,
      path: window.location.pathname
    })
  } catch (e) {
    console.warn('Umami not initialized:', e)
  }

  const subject = encodeURIComponent(`[Web] ${form.subject}`)
  const body    = encodeURIComponent(
    `Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
  )
  window.location.href = `mailto:hostalsol@outlook.com?subject=${subject}&body=${body}`
  sent.value = true
}
</script>

<style scoped>
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-heading {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 500;
  line-height: 1.1;
  margin: 8px 0 14px;
}
.page-lead {
  color: var(--dark-muted);
  font-size: 16px;
  line-height: 1.75;
  max-width: 720px;
  margin-bottom: 40px;
}

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 32px;
}
@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }

.block-heading {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
  color: var(--dark);
  margin: 0 0 16px;
}

/* Quick action buttons */
.quick-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
.quick-btn {
  display: flex; align-items: center; gap: 12px;
  background: var(--dark); color: #fff;
  border-radius: 12px; padding: 14px 20px;
  text-decoration: none; min-width: 200px;
  transition: opacity 0.2s;
}
.quick-btn:hover { opacity: 0.85; }
.quick-btn--wa    { background: var(--whatsapp); }
.quick-btn--email { background: #1565c0; }
.quick-btn__label {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.7;
}
.quick-btn__val   { font-size: 14px; font-weight: 700; margin-top: 2px; }

/* Info card */
.info-card {
  background: #fff; border-radius: 14px;
  padding: 24px 26px; box-shadow: 0 2px 14px rgba(0,0,0,0.06);
  margin-bottom: 28px;
}
.info-row {
  display: flex; gap: 14px; align-items: flex-start;
  margin-bottom: 18px;
}
.info-row:last-of-type { margin-bottom: 18px; }
.info-row__label {
  font-size: 11px; font-weight: 600;
  color: var(--dark-muted);
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
}
.info-row__val { color: var(--dark); font-size: 14.5px; line-height: 1.6; }

.map-link {
  display: inline-flex; align-items: center; gap: 7px;
  color: var(--green); font-weight: 600; font-size: 13.5px;
  text-decoration: none;
}
.map-link:hover { text-decoration: underline; }

/* Form card */
.form-card {
  background: #fff; border-radius: 14px;
  padding: 24px 26px; box-shadow: 0 2px 14px rgba(0,0,0,0.06);
}
.form-intro { color: var(--dark-muted); font-size: 14px; margin: 0 0 20px; line-height: 1.7; }
.contact-form { display: flex; flex-direction: column; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: 12px; font-weight: 600;
  color: var(--dark-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.form-field input, .form-field textarea {
  font-family: inherit; font-size: 14.5px;
  border: 1.5px solid var(--border);
  border-radius: 8px; padding: 11px 14px;
  background: #fff; color: var(--dark);
  transition: border-color 0.2s;
}
.form-field input:focus, .form-field textarea:focus {
  outline: none; border-color: var(--green);
}
.form-check {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 13px; color: var(--dark-muted); line-height: 1.5;
}
.form-check a { color: var(--green); font-weight: 600; }

.form-submit {
  align-self: flex-start;
  background: var(--green); color: #fff;
  border: none; border-radius: 8px;
  padding: 12px 28px; font-weight: 700; font-size: 14px;
  cursor: pointer; font-family: inherit;
  display: inline-flex; align-items: center; gap: 8px;
  transition: opacity 0.2s;
}
.form-submit:hover { opacity: 0.85; }

.form-sent {
  background: var(--green-light);
  border-left: 3px solid var(--green);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--dark);
  font-size: 13.5px;
}

/* Side panel */
.side-panel { display: flex; flex-direction: column; gap: 24px; }

.distances-card {
  background: #fff; border-radius: 14px;
  padding: 22px 24px; box-shadow: 0 2px 14px rgba(0,0,0,0.06);
}
.distances-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.distances-list li {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) auto;
  gap: 10px; align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}
.distances-list li:last-child { border-bottom: none; }
.distances-list__name { font-size: 13.5px; color: var(--dark); font-weight: 600; }
.distances-list__val  { font-size: 13px; color: var(--dark-muted); white-space: nowrap; }

.contact-map {
  width: 100%;
  height: 280px;
  border: none;
  border-radius: 14px;
  display: block;
}

.parking-note {
  display: flex; gap: 14px;
  background: var(--green-light);
  border-radius: 12px;
  padding: 16px 20px;
}
.parking-note p { margin: 0 0 6px; font-size: 13.5px; color: var(--dark); line-height: 1.5; }
.parking-link  { color: var(--green); font-weight: 700; font-size: 13.5px; text-decoration: none; }
.parking-link:hover { text-decoration: underline; }
</style>
