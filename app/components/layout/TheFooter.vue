<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Schedule strip -->
      <div class="footer__schedule">
        <div class="footer__schedule-item">
          <LucideIcon name="key" :size="13" color="rgba(255,255,255,0.5)" />
          <span>{{ t('contact.checkin') }} <strong>{{ t('contact.checkinVal') }}</strong></span>
        </div>
        <div class="footer__schedule-sep">·</div>
        <div class="footer__schedule-item">
          <LucideIcon name="log-out" :size="13" color="rgba(255,255,255,0.5)" />
          <span>{{ t('contact.checkout') }} <strong>{{ t('contact.checkoutVal') }}</strong></span>
        </div>
        <div class="footer__schedule-sep">·</div>
        <div class="footer__schedule-item">
          <LucideIcon name="clock" :size="13" color="rgba(255,255,255,0.5)" />
          <span>{{ t('contact.attention') }} <strong>{{ t('contact.attentionVal') }}</strong></span>
        </div>
        <div class="footer__schedule-sep">·</div>
        <div class="footer__schedule-item">
          <LucideIcon name="moon" :size="13" color="rgba(255,255,255,0.5)" />
          <span>{{ t('contact.sunday') }}: <strong>{{ t('contact.sundayVal') }}</strong></span>
        </div>
      </div>

      <!-- Quick-contact row -->
      <div class="footer__actions">
        <a href="tel:+34980533152" class="footer__action-btn">
          <LucideIcon name="phone" :size="14" color="#fff" /> +34 980 533 152
        </a>
        <a href="https://wa.me/34639980253" target="_blank" rel="noopener noreferrer" class="footer__action-btn footer__action-btn--wa">
          <LucideIcon name="message-circle" :size="14" color="#fff" /> WhatsApp +34 639 980 253
        </a>
        <a href="mailto:hostalsol@outlook.com" class="footer__action-btn">
          <LucideIcon name="mail" :size="14" color="#fff" /> Email
        </a>
        <NuxtLink to="/reserva" class="footer__action-btn footer__action-btn--reserve">
          <LucideIcon name="tag" :size="14" color="#fff" />
          {{ t('footer.reserveCta') }}
        </NuxtLink>
      </div>

      <!-- Bottom row -->
      <div class="footer__bottom">
        <span class="footer__copy">
          © {{ year }} Hostal Sol Zamora · {{ t('footer.family') }} · {{ t('footer.rights') }}
        </span>
        <nav class="footer__links">
          <NuxtLink to="/terminos-y-condiciones">{{ t('footer.terms') }}</NuxtLink>
          <NuxtLink to="/politica-de-cookies-ue">{{ t('footer.cookies') }}</NuxtLink>
          <NuxtLink to="/galeria">Galería</NuxtLink>
          <NuxtLink to="/parking">Parking</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
          <NuxtLink to="/checkin">Check-in</NuxtLink>
          <NuxtLink to="/reserva">{{ t('nav.reserve') }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--footer-bg);
  padding: 22px max(24px, 6vw);
  border-top: 1px solid rgba(255,255,255,0.07);
}

.footer__container { max-width: 1500px; margin: 0 auto; }

/* Schedule strip */
.footer__schedule {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.footer__schedule-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.45);
  font-size: 12px;
}
.footer__schedule-item strong { color: rgba(255,255,255,0.7); }
.footer__schedule-sep { color: rgba(255,255,255,0.2); font-size: 12px; }

.footer__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.footer__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.12);
  transition: background 0.2s;
}
.footer__action-btn:hover { background: rgba(255,255,255,0.14); }
.footer__action-btn--wa { background: var(--whatsapp); border-color: var(--whatsapp); }
.footer__action-btn--wa:hover { background: #1fb954; }
.footer__action-btn--reserve {
  background: var(--green);
  border-color: var(--green);
}
.footer__action-btn--reserve:hover { background: #5a8f4a; }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer__copy { color: rgba(255,255,255,0.3); font-size: 12px; }

.footer__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.footer__links a {
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer__links a:hover { color: rgba(255,255,255,0.6); }
</style>
