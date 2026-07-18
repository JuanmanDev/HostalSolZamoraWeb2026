<template>
  <section id="contact" class="contact section-padding">
    <div class="container grid-2">
      <!-- Left: info -->
      <div>
        <NuxtImg
          :src="LOGO_SVG"
          alt="Hostal Sol"
          width="864"
          height="198"
          class="contact__logo"
        />
        <UiSectionTag light>{{ t('contact.title') }}</UiSectionTag>
        <!-- <h2 class="contact__heading">{{ t('contact.heading') }}</h2> -->

        <div class="contact__info-list">
          <div v-for="item in infoItems" :key="item.icon" class="contact__info-row">
            <LucideIcon :name="item.icon" :size="18" color="rgba(255,255,255,0.5)" />
            <a
              v-if="item.href"
              :href="item.href"
              :target="item.external ? '_blank' : '_self'"
              rel="noopener noreferrer"
              class="contact__info-link"
            >{{ item.text }}</a>
            <span v-else class="contact__info-text">{{ item.text }}</span>
            <UiCopyBtn :text="item.text" />
          </div>
        </div>

        <div class="contact__action-btns">
          <a href="tel:+34980533152" class="contact__btn">
            <LucideIcon name="phone" :size="14" color="#fff" /> {{ t('contact.phone1') }}
          </a>
          <a href="https://wa.me/34639980253" target="_blank" rel="noopener noreferrer" class="contact__btn contact__btn--wa">
            <LucideIcon name="message-circle" :size="14" color="#000" /> WhatsApp
          </a>
          <a :href="`mailto:${t('contact.email')}`" class="contact__btn">
            <LucideIcon name="mail" :size="14" color="#fff" /> Email
          </a>
        </div>

        <!-- Pets note -->
        <!-- <div class="contact__pets-note">
          <LucideIcon name="paw-print" :size="16" color="var(--green)" />
          <span>{{ t('contact.pets') }}: <strong>{{ t('contact.petsVal') }}</strong> · {{ t('contact.petNote') }}</span>
        </div> -->
      </div>

      <!-- Right: key times + mini map -->
      <div>
        <div class="contact__times-row">
          <div class="contact__time-chip">
            <!-- <LucideIcon name="calendar-clock" :size="18" color="var(--green)" /> -->
            <div class="contact__time-both">
              <div class="contact__time-row">
                <LucideIcon name="log-in" :size="12" color="var(--green)" />
                <span class="contact__time-label">{{ t('contact.checkin') }}</span>
                <span class="contact__time-val">{{ t('contact.checkinVal') }}</span>
              </div>
              <div class="contact__time-row">
                <LucideIcon name="log-out" :size="12" color="var(--green)" />
                <span class="contact__time-label">{{ t('contact.checkout') }}</span>
                <span class="contact__time-val">{{ t('contact.checkoutVal') }}</span>
              </div>
            </div>
          </div>
          <div class="contact__time-chip">
            <LucideIcon name="clock" :size="16" color="var(--green)" />
            <div class="contact__time-both">
              <div class="contact__time-label">{{ t('contact.attention') }}</div>
              <div class="contact__time-val">{{ t('contact.attentionVal') }}</div>
            </div>
          </div>
        </div>

        <div class="contact__mini-map">
          <iframe
            src="https://maps.google.com/maps?q=Hostal+Sol,+Calle+Benavente,+2,+49014+Zamora+Espa%C3%B1a&output=embed&z=17"
            title="Mapa Hostal Sol Zamora"
            class="contact__map-frame"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LOGO_SVG, LOGO_ICON } from '~/composables/useRooms'

const { t } = useI18n()

const infoItems = computed(() => [
  { icon: 'map-pin',    text: t('contact.address'), href: 'https://www.google.com/maps/dir//Hostal+Sol,+Calle+Benavente,+2,+3%C2%BA,+49014+Zamora,+Espa%C3%B1a/@41.5062474,-5.7435342,18z/', external: true },
  { icon: 'phone',      text: t('contact.phone1'),  href: 'tel:+34980533152', external: false },
  { icon: 'smartphone', text: `${t('contact.phone2')}`, href: 'https://wa.me/34639980253', external: true },
  { icon: 'mail',       text: t('contact.email'),   href: `mailto:${t('contact.email')}`, external: false },
  // { icon: 'clock',      text: t('contact.hours'),   href: null, external: false },
])
</script>

<style scoped>
.contact { background: var(--dark); }

.contact__logo {
  height: 7rem;
  margin-bottom: 28px;
  filter: brightness(10);
  /* make the svg to contain */
  object-fit: contain;
  display: inline-block;
}

.contact__heading {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  color: #fff;
  margin: 8px 0 28px;
}

.contact__info-list { display: flex; flex-direction: column; gap: 14px; }

.contact__info-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.contact__info-link {
  color: rgba(255,255,255,0.8);
  font-size: 14.5px;
  flex: 1;
  transition: color 0.2s;
}
.contact__info-link:hover { color: #fff; }

.contact__info-text {
  color: rgba(255,255,255,0.8);
  font-size: 14.5px;
  flex: 1;
}

.contact__action-btns {
  display: flex;
  gap: 10px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.contact__btn {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  gap: 7px;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.2);
  transition: background 0.2s;
}
.contact__btn:hover { background: rgba(255,255,255,0.22); }
.contact__btn--wa { background: var(--whatsapp); border-color: var(--whatsapp); color: #000; font-weight: 700; }
.contact__btn--wa:hover { background: #1fb954; color: #000; }

/* Pets note */
.contact__pets-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  color: rgba(255,255,255,0.65);
  font-size: 13.5px;
  line-height: 1.5;
}

/* Time chips */
.contact__times-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.contact__time-chip {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background: rgba(104,126,86,0.18);
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid rgba(104,126,86,0.25);
}

.contact__time-both { display: flex; flex-direction: row; gap: 6px; justify-content: space-between; width: 100%;}

.contact__time-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.contact__time-label {
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-width: 72px;
}
.contact__time-val { color: #fff; font-size: 14px; font-weight: 700; }

.contact__mini-map {
  border-radius: 12px;
  overflow: hidden;
  height: 220px;
}
.contact__map-frame { width: 100%; height: 100%; border: none; display: block; }
</style>
