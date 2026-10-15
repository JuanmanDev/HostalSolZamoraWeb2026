<template>

  <SectionsContactSection />
  <footer class="footer">
    <div class="footer__container">

      <!-- Social row -->
      <!-- <div class="footer__social">
        <a
          href="https://www.instagram.com/hostalsolzamora/"
          target="_blank"
          rel="noopener noreferrer me"
          class="footer__social-btn"
          aria-label="Instagram"
        >
          <LucideIcon name="instagram" :size="16" color="rgba(255,255,255,0.65)" />
          <span>@hostalsolzamora</span>
        </a>
        <a
          href="https://www.facebook.com/hostalsolzam"
          target="_blank"
          rel="noopener noreferrer me"
          class="footer__social-btn"
          aria-label="Facebook"
        >
          <LucideIcon name="facebook" :size="16" color="rgba(255,255,255,0.65)" />
          <span>Hostal Sol</span>
        </a>
        <a
          href="https://wa.me/34639980253"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social-btn footer__social-btn--wa"
          aria-label="WhatsApp"
        >
          <LucideIcon name="message-circle" :size="16" color="rgba(255,255,255,0.85)" />
          <span>WhatsApp</span>
        </a>
      </div> -->

      <!-- NAP: name, address, phone — identical to the LodgingBusiness schema -->
      <address class="footer__nap">
        <strong>Hostal Sol Zamora</strong>
        <span>Calle Benavente, 2, 3ª planta · 49014 Zamora</span>
        <a href="tel:+34980533152">+34 980 533 152</a>
      </address>

      <!-- Bottom row -->
      <div class="footer__bottom">
        <span class="footer__copy">
          © {{ year }} Hostal Sol Zamora · {{ t('footer.rights') }}
        </span>
        <nav class="footer__links" aria-label="Footer">
          <NuxtLink :to="localePath('sobre-nosotros')">{{ t('nav.about') }}</NuxtLink>
          <NuxtLink :to="localePath('galeria')">{{ t('nav.rooms') }}</NuxtLink>
          <NuxtLink :to="localePath('parking')">{{ t('nav.parking') }}</NuxtLink>
          <NuxtLink :to="localePath('checkin')">{{ t('nav.checkin') }}</NuxtLink>
          <NuxtLink :to="localePath('faq')">{{ t('nav.faq') }}</NuxtLink>
          <NuxtLink :to="localePath('contacto')">{{ t('nav.contact') }}</NuxtLink>
          <NuxtLink :to="localePath('reserva')">{{ t('nav.reserve') }}</NuxtLink>
          <template v-if="hasGuides">
            <NuxtLink :to="localePath('semana-santa-zamora')">{{ t('nav.semanaSanta') }}</NuxtLink>
            <NuxtLink :to="localePath('peregrinos-via-de-la-plata-zamora')">{{ t('nav.peregrinos') }}</NuxtLink>
          </template>
          <NuxtLink :to="localePath('terminos-y-condiciones')">{{ t('footer.terms') }}</NuxtLink>
          <NuxtLink :to="localePath('politica-de-cookies-ue')">{{ t('footer.cookies') }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
// Guide pages only exist in Spanish and English (defineI18nRoute)
const hasGuides = computed(() => ['es', 'en'].includes(locale.value))
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--footer-bg);
  padding: 22px max(24px, 6vw);
  border-top: 1px solid rgba(255,255,255,0.07);
}

.footer__container { max-width: 1500px; margin: 0 auto; }

.footer__nap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  font-style: normal;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.footer__nap strong { color: rgba(255,255,255,0.9); font-weight: 600; }
.footer__nap a {
  color: rgba(255,255,255,0.9);
  text-decoration: underline;
  text-underline-offset: 3px;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
}

/* Social row */
.footer__social {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.footer__social-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.footer__social-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
.footer__social-btn--wa { background: var(--whatsapp); border-color: var(--whatsapp); color: #fff; }
.footer__social-btn--wa:hover { background: #1fb954; }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer__copy { color: rgba(255,255,255,0.6); font-size: 12px; }

.footer__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.footer__links a {
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer__links a:hover { color: rgba(255,255,255,1); }
</style>
