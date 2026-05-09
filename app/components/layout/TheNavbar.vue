<template>
  <nav class="navbar" :class="{ 'navbar--solid': scrolled }">
    <div class="navbar__inner">
      <NuxtLink to="/" class="navbar__logo-btn" @click.prevent="handleLogoClick">
        <img
          :src="LOGO_SVG"
          alt="Hostal Sol Zamora"
          class="navbar__logo"
          @error="(e) => { (e.target as HTMLImageElement).src = LOGO_ICON }"
        />
      </NuxtLink>

      <div class="navbar__spacer" />

      <div class="navbar__desktop">
        <template v-for="link in navLinks" :key="link.key">
          <button
            v-if="link.section"
            :class="['navbar__link', { 'navbar__link--cta': link.cta }]"
            @click="handleSectionNav(link.section!)"
          >
            {{ t(`nav.${link.key}`) }}
          </button>
          <NuxtLink
            v-else
            :to="link.route!"
            :class="['navbar__link', { 'navbar__link--cta': link.cta }]"
          >
            {{ t(`nav.${link.key}`) }}
          </NuxtLink>
        </template>
        <UiGlobalSearch :solid="scrolled" />
        <LayoutLangSwitcher />
      </div>
      
      <div class="navbar__mobile">
        <NuxtLink to="/reserva" class="navbar__cta-button">
          {{ t('nav.reserve') }}
        </NuxtLink> 

        <UiGlobalSearch :solid="scrolled" />
        
        <button class="navbar__hamburger" @click="menuOpen = !menuOpen">
          <LucideIcon :name="menuOpen ? 'x' : 'menu'" :size="22" :color="scrolled ? 'var(--dark)' : '#fff'" />
        </button>
      </div>
    </div>

    <Transition name="slide-down">
      <div v-if="menuOpen" class="navbar__dropdown">
        <div class="navbar__dropdown-link navbar__dropdown-link--accent">
          <LayoutLangSwitcher />
        </div>
        <template v-for="link in navLinks" :key="link.key">
          <button
            v-if="link.section"
            :class="['navbar__dropdown-link', { 'navbar__dropdown-link--accent': link.cta }]"
            @click="handleMobileSectionNav(link.section!)"
          >
            {{ t(`nav.${link.key}`) }}
          </button>
          <NuxtLink
            v-else
            :to="link.route!"
            :class="['navbar__dropdown-link', { 'navbar__dropdown-link--accent': link.cta }]"
            @click="menuOpen = false"
          >
            {{ t(`nav.${link.key}`) }}
          </NuxtLink>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { LOGO_SVG, LOGO_ICON } from '~/composables/useRooms'

const { t } = useI18n()
const { scrollTo } = useScrollTo()
const route = useRoute()
const router = useRouter()

const props = defineProps<{ solidFromStart?: boolean }>()

const _scrolled = ref(false)
const scrolled  = computed(() => props.solidFromStart || _scrolled.value)
const menuOpen  = ref(false)

const navLinks = [
  { key: 'home',    section: 'hero',  route: null,      cta: false },
  { key: 'rooms',   section: 'rooms', route: null,      cta: false },
  { key: 'parking', section: null,    route: '/parking', cta: false },
  { key: 'faq',     section: null,    route: '/faq',     cta: false },
  { key: 'checkin', section: null,    route: '/checkin', cta: false },
  { key: 'reserve', section: null,    route: '/reserva', cta: true  },
]

function handleLogoClick() {
  if (route.path === '/') {
    scrollTo('hero')
  } else {
    router.push('/')
  }
}

function handleSectionNav(id: string) {
  if (route.path === '/') {
    scrollTo(id)
  } else {
    router.push(`/#${id}`)
  }
}

function handleMobileSectionNav(id: string) {
  menuOpen.value = false
  if (route.path === '/') {
    scrollTo(id)
  } else {
    router.push(`/#${id}`)
  }
}

onMounted(() => {
  const handler = () => { _scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})
</script>

<style scoped>
.navbar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 900;
  padding: 0 max(24px, 3vw);
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transition: background 0.35s, border-color 0.35s, backdrop-filter 0.35s;
}

.navbar--solid {
  background: rgba(250, 248, 243, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: var(--border);
}

.navbar__inner {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 64px;
  gap: 12px;
}

.navbar__logo-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.navbar__logo {
  height: 36px;
  display: block;
  filter: brightness(10);
  transition: filter 0.35s;
}
.navbar--solid .navbar__logo { filter: none; }

.navbar__spacer { flex: 1; }

.navbar__desktop {
  display: flex;
  gap: 2px;
  align-items: center;
}

.navbar__link {
  background: none;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  transition: color 0.2s, background 0.2s, opacity 0.2s;
  border-radius: 6px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.navbar--solid .navbar__link { color: var(--dark); }
.navbar__link:hover { color: var(--green); }
.navbar--solid .navbar__link:hover { color: var(--green); }

.navbar__link--cta {
  background: var(--green);
  color: #fff !important;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
}
.navbar__link--cta:hover { opacity: 0.85; color: #fff !important; }

.navbar__mobile {
  display: none;
  align-items: center;
  gap: 10px;
}
.navbar__hamburger {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.navbar__dropdown {
  background: var(--cream);
  border-top: 1px solid var(--border);
  padding: 8px 0 16px;
}
.navbar__dropdown-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 24px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
  color: var(--dark);
  text-decoration: none;
  transition: background 0.15s;
}
.navbar__dropdown-link:hover { background: var(--green-light); }
.navbar__dropdown-link--accent { color: var(--green); font-weight: 700; }

@media (max-width: 768px) {
  .navbar__desktop { display: none; }
  .navbar__mobile  { display: flex; }
}

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

.navbar__cta-button {
  background: var(--green);
  color: #fff !important;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  transition: opacity 0.2s, color 0.2s;
}

</style>

<style>

.navbar--solid .lang__trigger,
.navbar__dropdown .lang__trigger{
  color: var(--dark) ;
  border: 1px solid var(--border) ;
}
</style>
