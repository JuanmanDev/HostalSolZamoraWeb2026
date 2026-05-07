<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="page-content">
      <!-- Header -->
      <section class="page-section">
        <UiSectionTag>Parking</UiSectionTag>
        <h1 class="page-heading">{{ t('pages.parking.heading') }}</h1>
        <p class="page-lead">{{ t('pages.parking.lead') }}</p>

        <div class="addr-card">
          <LucideIcon name="building-2" :size="24" color="var(--green)" />
          <div>
            <strong>{{ t('pages.parking.addressCard.title') }}</strong>
            <p class="addr-card__text">{{ t('pages.parking.addressCard.address') }}</p>
            <p class="addr-card__tip">{{ t('pages.parking.addressCard.tip') }}</p>
          </div>
        </div>
        <NuxtLink to="/checkin" class="checkin-link">
          <LucideIcon name="key" :size="15" color="var(--green)" />
          {{ t('pages.parking.checkinLink') }}
        </NuxtLink>
      </section>

      <!-- Car/moto access -->
      <section class="page-section">
        <h2 class="section-heading">{{ t('pages.parking.carAccess') }}</h2>
        <p class="section-body">{{ t('pages.parking.carAccessDesc') }}</p>
        <div class="nav-apps">
          <a
            v-for="app in hostalNavApps"
            :key="app.name"
            :href="app.href"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-app-btn"
            :style="{ background: app.color }"
          >
            <LucideIcon name="navigation" :size="14" color="#fff" />
            {{ app.name }}
          </a>
        </div>
      </section>

      <!-- Street parking -->
      <section class="page-section">
        <h2 class="section-heading">{{ t('pages.parking.streetParking') }}</h2>
        <p class="section-body">Zonas de aparcamiento en calle gratuito o de zona azul cercanas al hostal.</p>
        <div class="parking-grid">
          <div v-for="spot in streetSpots" :key="spot.name" class="parking-card">
            <div class="parking-card__top">
              <LucideIcon name="parking-square" :size="22" color="var(--green)" />
              <span :class="['parking-card__price', { 'parking-card__price--free': spot.free }]">{{ spot.price }}</span>
            </div>
            <div class="parking-card__name">{{ spot.name }}</div>
            <div class="parking-card__dist">
              <LucideIcon name="footprints" :size="12" color="var(--green)" /> {{ spot.walk }}
            </div>
            <p v-if="spot.note" class="parking-card__tip">{{ spot.note }}</p>
            <a :href="spot.mapsUrl" target="_blank" rel="noopener noreferrer" class="parking-card__nav">
              <LucideIcon name="navigation" :size="13" color="var(--green)" /> Navegar
            </a>
          </div>
        </div>
      </section>

      <!-- Underground parking -->
      <section class="page-section">
        <h2 class="section-heading">{{ t('pages.parking.undergroundParking') }}</h2>
        <p class="section-body">Aparcamientos subterráneos cubiertos con acceso 24h.</p>
        <div class="parking-grid">
          <div v-for="spot in undergroundSpots" :key="spot.name" class="parking-card parking-card--underground">
            <div class="parking-card__top">
              <LucideIcon name="warehouse" :size="22" color="var(--green)" />
              <span class="parking-card__price">{{ spot.price }}</span>
            </div>
            <div class="parking-card__name">{{ spot.name }}</div>
            <div class="parking-card__dist">
              <LucideIcon name="footprints" :size="12" color="var(--green)" /> {{ spot.walk }}
            </div>
            <p class="parking-card__tip">{{ spot.details }}</p>
            <div class="parking-card__actions">
              <a :href="spot.mapsUrl" target="_blank" rel="noopener noreferrer" class="parking-card__nav">
                <LucideIcon name="navigation" :size="13" color="var(--green)" /> Navegar
              </a>
              <a v-if="spot.webUrl" :href="spot.webUrl" target="_blank" rel="noopener noreferrer" class="parking-card__nav">
                <LucideIcon name="external-link" :size="13" color="var(--green)" /> Web
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Map embed -->
      <section class="page-section">
        <h2 class="section-heading">{{ t('map.title') }}</h2>
        <iframe
          src="https://maps.google.com/maps?q=Calle+Benavente,+2,+49014+Zamora&output=embed&z=16"
          title="Hostal Sol Zamora"
          class="page-map"
          loading="lazy"
        />
      </section>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: computed(() => t('pages.parking.title')),
  meta: [{ name: 'description', content: computed(() => t('pages.parking.description')) as any }],
})

const hostalNavApps = [
  { name: 'Google Maps', color: '#4285f4', href: 'https://www.google.com/maps/dir//Calle+San+Miguel,+Zamora' },
  { name: 'Apple Maps',  color: '#1c1c1e', href: 'https://maps.apple.com/?q=Calle+San+Miguel+Zamora&ll=41.5065,-5.7450' },
  { name: 'Waze',        color: '#33ccff', href: 'https://waze.com/ul?ll=41.5065,-5.7450&navigate=yes&q=Calle+San+Miguel+Zamora' },
]

interface ParkingSpot {
  name: string
  price: string
  walk: string
  note?: string
  details?: string
  mapsUrl: string
  webUrl?: string
  free?: boolean
}

const streetSpots: ParkingSpot[] = [
  {
    name: 'Plaza Cuartel Viejo',
    price: 'Gratis',
    walk: '8 min. a pie',
    note: 'Amplia zona de aparcamiento gratuito en el exterior del casco histórico.',
    mapsUrl: 'https://www.google.com/maps/dir//Plaza+Cuartel+Viejo,+Zamora',
    free: true,
  },
  {
    name: 'Plaza San Esteban',
    price: 'Gratis',
    walk: '5 min. a pie',
    note: 'Zona libre junto a la iglesia de San Esteban, en el corazón del casco histórico.',
    mapsUrl: 'https://www.google.com/maps/dir//Plaza+San+Esteban,+Zamora',
    free: true,
  },
  {
    name: 'Plaza San Sebastián',
    price: 'Gratis',
    walk: '6 min. a pie',
    note: 'Aparcamiento libre en plaza abierta, a pocos minutos del hostal.',
    mapsUrl: 'https://www.google.com/maps/dir//Plaza+San+Sebastian,+Zamora',
    free: true,
  },
  {
    name: 'Zona Puerta Nueva',
    price: 'Zona azul',
    walk: '4 min. a pie',
    note: 'Zona de estacionamiento regulado. Gratis por la noche y festivos.',
    mapsUrl: 'https://www.google.com/maps/dir//Puerta+Nueva,+Zamora',
  },
  {
    name: 'Ciudad Deportiva',
    price: 'Gratis',
    walk: '12 min. a pie',
    note: 'Gran aparcamiento gratuito junto a las instalaciones deportivas municipales.',
    mapsUrl: 'https://www.google.com/maps/dir//Ciudad+Deportiva+Zamora',
    free: true,
  },
]

const undergroundSpots: ParkingSpot[] = [
  {
    name: 'Parking Plaza Constitución',
    price: '14,70€/24h',
    walk: '3 min. a pie',
    details: '1,45€/h · Abierto 24h · Tel. 980 53 72 08',
    mapsUrl: 'https://www.google.com/maps/dir//Parking+Plaza+Constitucion+Zamora',
  },
  {
    name: 'Parking La Marina (Empark)',
    price: 'Consultar tarifa',
    walk: '5 min. a pie',
    details: 'Gestionado por Empark. Reserva online disponible en empark.com.',
    mapsUrl: 'https://www.google.com/maps/dir//Parking+La+Marina+Zamora',
    webUrl: 'https://www.empark.com',
  },
]
</script>

<style scoped>
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.page-section { margin-bottom: 56px; }

.page-heading {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 14px;
}
.page-lead {
  color: var(--dark-muted);
  font-size: 16px;
  line-height: 1.75;
  max-width: 680px;
  margin-bottom: 28px;
}
.section-heading {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 500;
  color: var(--dark);
  margin-bottom: 8px;
}
.section-body {
  color: var(--dark-muted);
  font-size: 15px;
  line-height: 1.75;
  margin-bottom: 20px;
  max-width: 680px;
}

.addr-card {
  background: var(--green-light);
  border-radius: 12px;
  padding: 20px 22px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  max-width: 680px;
}
.addr-card__text { color: var(--dark-muted); font-size: 14px; margin-top: 4px; }
.addr-card__tip  { color: var(--dark-muted); font-size: 13.5px; margin-top: 6px; line-height: 1.6; }

.checkin-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--green);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 14px;
}
.checkin-link:hover { text-decoration: underline; }

.nav-apps { display: flex; gap: 10px; flex-wrap: wrap; }
.nav-app-btn {
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
.nav-app-btn:hover { opacity: 0.85; }

.parking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.parking-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1.5px solid transparent;
}
.parking-card--underground { border-color: var(--green-light); }

.parking-card__top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
.parking-card__price {
  background: var(--green);
  color: #fff;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
}
.parking-card__price--free { background: #2e7d32; }

.parking-card__name { font-weight: 700; font-size: 15px; color: var(--dark); }
.parking-card__dist { color: var(--green); font-size: 13px; font-weight: 600; display: flex; gap: 5px; align-items: center; }
.parking-card__tip { color: var(--dark-muted); font-size: 13.5px; line-height: 1.6; flex: 1; }

.parking-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.parking-card__nav {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: var(--green-light);
  color: var(--green);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.parking-card__nav:hover { background: #d8e0d0; }

.page-map { width: 100%; height: 400px; border: none; border-radius: 12px; display: block; }

@media (max-width: 560px) {
  .parking-grid { grid-template-columns: 1fr; }
}
</style>
