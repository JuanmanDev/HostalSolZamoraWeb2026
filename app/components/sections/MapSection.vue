<template>
  <section id="map" class="map-section">
    <!-- Header -->
    <div class="map-section__header container-md">
      <UiSectionTag>{{ t('map.title') }}</UiSectionTag>
      <div class="map-section__top">
        <div>
          <h2 class="map-section__heading">{{ t('map.sub') }}</h2>
          <p class="map-section__address">
            <LucideIcon name="map-pin" :size="14" color="var(--green)" style="display:inline-block;vertical-align:middle;margin-right:6px" />
            <strong>Calle Benavente, 2</strong> · 3ª planta · <strong>49014</strong> Zamora
          </p>
        </div>

        <div class="map-section__chips-row">
          <div v-for="chip in chips" :key="chip.key" class="chip">
            <LucideIcon :name="chip.icon" :size="16" color="var(--green)" />
            <span>{{ t(`map.${chip.key}`) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Full-width map embed -->
    <div class="map-section__embed-wrap">
      <iframe
        src="https://maps.google.com/maps?q=Hostal+Sol,+Calle+Benavente,+2,+49014+Zamora+Espa%C3%B1a&output=embed&z=17"
        title="Hostal Sol Zamora"
        class="map-section__embed"
        loading="lazy"
      />
    </div>

    <!-- Nav app buttons — below the map -->
    <div class="map-section__nav-apps container-md">
      <NuxtLink :to="localePath('checkin')" class="btn btn-primary map-section__arrive-btn">
        <LucideIcon name="car" :size="15" color="#fff" />
        {{ t('map.howToArrive') }}
      </NuxtLink>
      
      <span class="map-section__nav-label">
        <!-- <LucideIcon name="navigation" :size="14" color="var(--green)" />
        {{ t('map.openIn') }} -->
      </span>
      <a
        v-for="app in navApps"
        :key="app.name"
        :href="app.href"
        target="_blank"
        rel="noopener noreferrer"
        class="map-section__nav-btn"
        :style="{ background: app.color }"
      >
        <span v-if="app.svgPath" class="map-section__nav-svg" v-html="app.svgPath" />
        <LucideIcon v-else :name="app.icon ?? 'navigation'" :size="14" color="#fff" />
        {{ app.name }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
interface MapNavApp {
  name: string
  color: string
  href: string
  svgPath?: string
  icon?: string
}

const { t } = useI18n()
const localePath = useLocalePath()

const navApps: MapNavApp[] = [
  {
    name: 'Google Maps', color: '#4285f4',
    href: 'https://www.google.com/maps/dir//Hostal+Sol,+Calle+Benavente,+2,+3%C2%BA,+49014+Zamora,+Espa%C3%B1a/@41.5062474,-5.7435342,18z/',
    svgPath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  },
  {
    name: 'Apple Maps', color: '#1c1c1e',
    href: 'https://maps.apple/p/5NVDS6BJpi3Ihy',
    svgPath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
  },
  {
    name: 'Waze', color: '#33ccff',
    href: 'https://www.waze.com/es/live-map/directions/es/cl/zamora/hostal-sol?navigate=yes&to=place.ChIJ72vc5TAeOQ0RRra7dNoyQyc',
    icon: 'navigation',
  },
  {
    name: 'Bing Maps', color: '#008373',
    href: 'https://www.bing.com/maps?q=Calle+Benavente+2+49014+Zamora&lvl=17',
    icon: 'map-pin',
  },
]

const chips = [
  { key: 'walkOld',     icon: 'landmark' },
  { key: 'walkStation', icon: 'train' },
  { key: 'parkingNear', icon: 'parking-square' },
]
</script>

<style scoped>
.map-section { background: #fff; padding: 80px 0 0; }

.map-section__header {
  padding: 0 max(24px, 6vw);
  margin-bottom: 28px;
}

.map-section__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
}

.map-section__heading {
  font-size: clamp(1.6rem, 2.5vw, 2.4rem);
  color: var(--dark);
  margin: 0 0 10px;
}
.map-section__address {
  color: var(--dark-muted);
  font-size: 15px;
  margin-bottom: 0;
}

.map-section__chips-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.map-section__arrive-btn { font-size: 14px; align-self: flex-start; }

/* Map embed */
.map-section__embed-wrap { width: 100%; height: 420px; margin-top: 28px; }
.map-section__embed { width: 100%; height: 100%; border: none; display: block; }

/* Nav apps — below map */
.map-section__nav-apps {
  padding: 24px max(24px, 6vw) 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.map-section__nav-label {
  display: inline-flex;
  align-items: left;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-grow: 10;;
}

.map-section__nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}
.map-section__nav-btn:hover { opacity: 0.85; }
.map-section__nav-svg { display: flex; align-items: center; }


@media (max-width: 860px) {
  .map-section__top { flex-direction: column; }
}

@media (max-width: 860px) {
  .map-section__arrive-btn { flex: 0 0 100%; text-align: center; justify-content: center; }
  .map-section__nav-btn { flex: 1 1 calc(50% - 5px); justify-content: center; }
  .map-section__nav-label { display: none; }
}
</style>
