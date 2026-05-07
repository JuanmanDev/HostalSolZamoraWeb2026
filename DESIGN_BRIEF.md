# Hostal Sol Zamora — Design Brief

> Exported from Claude Design (claude.ai/design) · Last iterated 2026-05-03
> This document captures every design decision, content value, component, and constraint needed before implementation.

---

## 1. Project Overview

A full multilingual website redesign for **Hostal Sol Zamora**, a family-run boutique hostel in the historic centre of Zamora, Spain. The family has been in the hospitality business since **1975** (starting as Pensión Padornelo on Calle Aire), evolving into Hostal Sol + Restaurante Padornelo. The site must feel boutique and Nordic-minimal while being highly functional for travellers.

**Live site for reference:** https://hostalsolzamora.com/

---

## 2. File Structure

```
/ (root)
├── index.html            ← Main site shell (Hostal Sol Zamora.html)
├── HostalApp.jsx         ← React app (all sections)
├── i18n.js               ← All translations (12 languages)
├── FAQ.html              ← Full FAQ sub-page
├── Parking.html          ← Full parking guide sub-page
├── Reserva.html          ← Booking engine sub-page
└── CheckIn.html          ← Arrival guide + legal check-in docs sub-page
```

---

## 3. Design System

### 3.1 Color Palette

| Token            | Hex       | Usage                              |
|------------------|-----------|------------------------------------|
| `--green`        | `#687e56` | Primary accent, buttons, links     |
| `--green-light`  | `#edf0e8` | Section backgrounds, chips, cards  |
| `--cream`        | `#faf8f3` | Page background                    |
| `--dark`         | `#2a2a22` | Body text, headings                |
| `--dark-muted`   | `#6a6a5a` | Secondary text, labels             |
| `--border`       | `#e2e0d8` | Dividers, card borders             |
| `#15150f`        | —         | Footer background                  |
| `#25d366`        | —         | WhatsApp button                    |
| `#ff0000`        | —         | YouTube button                     |
| `#c9a84c`        | —         | Star rating colour                 |

### 3.2 Typography

| Role       | Font                          | Weights          |
|------------|-------------------------------|------------------|
| Display    | Cormorant Garamond (serif)    | 400, 500, 600    |
| Body / UI  | Plus Jakarta Sans (sans-serif)| 400, 500, 600, 700 |

- Headings use `font-family: 'Cormorant Garamond', serif`
- All other text uses `Plus Jakarta Sans`
- Body `font-size`: 15–16px, `line-height`: 1.75–1.8
- Section tags: 11px, weight 600, uppercase, letter-spacing 0.12em, `--green`

### 3.3 Spacing & Layout

- Section padding: `80px max(24px, 6vw)`
- Max content width: `1500px` (main), `1400px` (sub-pages), `900px` (FAQ/Reserve centred)
- Responsive breakpoints: `860px` (2-col → 1-col), `768px` (hamburger nav), `640px`
- Border radius: cards 12–14px, buttons 8–10px, pills 20px

### 3.4 Effects

- `box-shadow` on cards: `0 2px 10px rgba(0,0,0,0.06)` — `0 8px 40px rgba(0,0,0,0.4)`
- Navbar: frosted glass on scroll (`backdrop-filter: blur(12px)`)
- Scrollbar: 6px, green thumb
- `::selection`: green background, white text
- Image hover: `transform: scale(1.05)`
- Smooth scroll on `html`
- RTL support for Arabic (`dir="rtl"`)

### 3.5 Icon Library

**Lucide Icons** (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`) — replaces all emoji. Key icons used:

`globe`, `menu`, `x`, `tag`, `map-pin`, `building-2`, `paw-print`, `star`, `bed-double`, `bed-single`, `building`, `image`, `play-circle`, `layout-grid`, `play`, `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`, `tv-2`, `parking-square`, `navigation`, `info`, `landmark`, `train`, `car`, `phone`, `smartphone`, `mail`, `clock`, `key`, `log-out`, `moon`, `shield-check`, `x-circle`, `lock`, `zap`, `calendar-check`, `copy`, `check`, `footprints`, `utensils-crossed`, `plus`, `minus`

---

## 4. Dependencies (CDN)

```html
<!-- Fonts -->
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700

<!-- Icons -->
https://unpkg.com/lucide@latest/dist/umd/lucide.min.js

<!-- React 18 -->
https://unpkg.com/react@18.3.1/umd/react.development.js
https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js

<!-- Babel (for JSX in browser) -->
https://unpkg.com/@babel/standalone@7.29.0/babel.min.js
```

> Production implementation should bundle React + Babel instead of using CDN dev builds.

---

## 5. Assets & Content

### 5.1 Logo

| Asset   | URL                                                                                     |
|---------|-----------------------------------------------------------------------------------------|
| SVG logo | `https://hostalsolzamora.com/wp-content/uploads/2022/03/Logotipo-header_Mesa-de-trabajo-1-copia.svg` |
| Icon PNG | `https://hostalsolzamora.com/wp-content/uploads/2022/03/isotipo-1024x1024.png` (fallback) |

Logo is shown white-on-dark (CSS `filter: brightness(10)`) in the footer.

### 5.2 Hero Photos (slideshow, 5s interval)

```
BASE = https://hostalsolzamora.com/wp-content/uploads

1. {BASE}/2022/03/Recepcion-2-retocada.jpg
2. {BASE}/2023/04/Habitaciones_2023-3-1024x769.jpg
3. {BASE}/2023/04/Habitaciones_2023-8-1024x769.jpg
4. {BASE}/2023/04/Habitaciones_2023-22-1024x768.jpg
5. {BASE}/2022/03/Pasillo-1-2.jpg
```

### 5.3 Room Photos

URL pattern: `{BASE}/2023/04/Habitaciones_2023-{N}-{WxH}.jpg`

Photo numbers 1–97 (not all exist). Dimensions per photo number documented in `PHOTO_DIMS` object in HostalApp.jsx.

**Room groups (photo IDs):**

| Room   | Photo IDs             |
|--------|-----------------------|
| 301    | 2,3,4,5,6             |
| 302    | 7,8,9,10,11           |
| 303    | 12,13,14,15,16        |
| 304    | 17,18,19,20,21        |
| 305    | 22,23,24,25,26        |
| 306    | 27,28,29,30,31        |
| 307    | 32,33,34,35,36        |
| 308    | 37,38,39,40,41        |
| 309    | 42,43,44,45,46        |
| 310    | 47,48,49,50,51        |
| 311    | 52,53,54,55,56        |
| 312    | 57,58,59,60,61        |
| 321    | 62,63,64,65,66        |
| 322    | 67,68,69,70           |
| 323    | 72,73,74,75           |
| 324    | 76,77,78,79,80        |
| Entrada| 81,82,83,84,86,87,88,89,1 |

### 5.4 YouTube

| Key           | Value                                    |
|---------------|------------------------------------------|
| Channel ID    | `UCMzo7LwahJEbzbt1A5rtC5g`               |
| Shorts page   | `https://www.youtube.com/@HostalSolZamora/shorts` |
| Channel embed | `https://www.youtube.com/embed?listType=playlist&list=UUMzo7LwahJEbzbt1A5rtC5g&rel=0` |

> Room-specific YouTube Short IDs are **placeholders** (`dQw4w9WgXcQ`) — need real IDs from the channel.

### 5.5 About section image

`{BASE}/2022/03/imagen-qs-1024x1024.webp`

---

## 6. Pages

### 6.1 Main page — `index.html`

**Section order:**

1. `<Navbar>`
2. `<Hero>` — `#hero`
3. `<About>` — no ID
4. `<Rooms>` — `#rooms`
5. `<Videos>` — no ID
6. `<MapSection>` — `#map`
7. `<Parking>` — `#parking`
8. `<Reviews>` — no ID
9. `<Recommendation>` — no ID (Restaurante Padornelo)
10. `<FAQ>` — `#faq`
11. `<Reservation>` — `#reserve`
12. `<Contact>` — `#contact`
13. `<Footer>`

---

### 6.2 Component Specs

#### Navbar
- Fixed, transparent on top → frosted cream on scroll (after 60px)
- Logo left, desktop nav links centre-right, language switcher far right
- Mobile: hamburger opens dropdown below nav
- Nav links: `Inicio | Habitaciones | Mapa | Parking | FAQ | Reservar | Contacto`
- "Reservar" link styled as green pill button
- Language dropdown: all 12 languages with native name + code

#### Hero
- Full-viewport (`100vh`, min 580px)
- 5-photo crossfade slideshow (opacity transition 1.2s, 5s interval)
- Dark gradient overlay: `linear-gradient(160deg, rgba(25,25,15,0.6) 0%, rgba(50,55,35,0.3) 100%)`
- Top-centre discount banner: green pill with tag icon
- Content left-aligned, vertically centred
- Small tag label above title
- H1: Cormorant Garamond, `clamp(2.8rem, 7vw, 6.5rem)`, white
- Subtitle: white 85% opacity
- Two CTAs: "Reservar ahora" (green) + "Ver habitaciones" (glass)
- Dot pagination at bottom

#### About / History
- Background: `--green-light`
- 2-column grid (stacks on mobile)
- Left: tag, h2, body text, expandable history (toggle "Ver más historia" / "Ver menos"), "since 1975" line
- Right: 2×2 info chips (Centro histórico, 3ª planta · C.P. 49014, Pet friendly · +6€/noche, 9.2/10 · Booking) + photo
- Expanded history text (hardcoded in ES):
  - 1975: Pensión Padornelo, Calle Aire
  - Evolution to Hostal Sol + Restaurante Padornelo
  - Today: Nordic-minimal style, historic centre

#### Rooms + Multimedia gallery
- Background: white
- 3 room type cards at top (grid 3-col, stacks on mobile):
  - **Doble de matrimonio** — icon: `bed-double` — photo: #3
  - **Matrimonio con balcón** — icon: `building` — photo: #8 — extra: "Balcón privado"
  - **Dos camas individuales** — icon: `bed-single` — photo: #22
  - All include: TV, WiFi, Baño privado, Escritorio, Calefacción central, Amenities, Toallas y ropa de cama
- Filter bar:
  - Room filter (pill buttons): All + 301–324 + Entrada
  - Media type filter (toggle): Todo / Fotos / Vídeos
- Mixed media grid: `auto-fill, minmax(200px, 1fr)`, gap 8px
  - Photos: clickable, open lightbox
  - Video card (injected at position 2 per room): dark overlay + red YouTube play button
  - Shows 18 items, "Ver todas" button reveals rest
- Lightbox: black overlay, full-size photo, X close button

#### Videos
- Background: `--dark` (#2a2a22)
- YouTube channel embed (16:9 iframe, full width within section padding)
- Horizontal scrollable carousel of room cards (17 rooms + Entrada)
  - Each card: 200px wide, photo thumbnail with play button overlay, room label, "YouTube Shorts ↗"
  - Left/right chevron buttons
- CTA buttons: "Ver en YouTube" (red) + "Canal YouTube" (dark glass)

#### Map
- Background: white
- Header row with title, full address, 3ª planta info
- 4 navigation app buttons: Google Maps (blue `#4285f4`), Apple Maps (black), Waze (cyan), Bing Maps (teal)
- 3 distance chips: 5 min. casco antiguo, 15 min. estación, Parking cercano
- "Cómo llegar" button → `CheckIn.html`
- Full-width Google Maps embed (height 420px): `https://maps.google.com/maps?q=Calle+Benavente,+2,+49014+Zamora&output=embed&z=17`
- Below map: info note about 3ª planta + link to CheckIn.html

#### Parking summary
- Background: `--green-light`
- 4 parking option cards (auto-fill grid, minmax 260px):
  - Parking Centro (Viriato) — 3 min. a pie — ~1€/h — El más cercano, cubierto 24h
  - Parking Plaza Mayor — 5 min. — ~0.8€/h — Amplio y económico
  - Zona ORA Calle Benavente — En la puerta — ~0.5€/h — Zona azul, límite 2h
  - Zona libre nocturna — 2 min. — Gratis (noche) — A partir de 20h y domingos
- Each card: parking icon, price badge, name, distance, tip text, "Navegar" button → Google Maps link
- "Ver guía completa →" button → `Parking.html`

#### Reviews carousel
- Background: `--cream`
- Auto-scrolling carousel (4.5s interval), snaps to active card
- 8 real guest reviews (see i18n.js ES section for all text)
- Active card: green border + stronger shadow
- Dot pagination

#### Restaurante Padornelo (Recommendation)
- Background: white
- 2-column grid (stacks mobile)
- Left: description text, "Ver en Google Maps" button + "A 2 minutos del hostal" chip
- Right: rotating photo carousel (3s interval) from Google Maps URLs (with fallback to green icon placeholder)
- Google Maps link: `https://www.google.com/maps/search/Restaurante+Padornelo+Zamora`

#### FAQ (homepage section)
- Background: `--green-light`
- Max-width 900px centred
- Shows first 6 FAQ items (accordion)
- "Ver todas las preguntas →" text link + green CTA button → `FAQ.html`

#### Reservation section
- Background: white
- Max-width 900px centred
- Large green discount block: `−15% en nuestra web`
- 4 feature chips: Mejor precio, Cancelación gratuita 48h, Pago seguro, Confirmación inmediata
- Primary CTA: "Ir al motor de reservas" → `Reserva.html`
- Secondary text link for iframe fallback → `Reserva.html`
- **No iframe on the main page**

#### Contact
- Background: `--dark`
- 2-column grid
- Left: white logo, contact info list with copy buttons:
  - Address: Calle Benavente, 2 — 3ª planta · C.P. 49014 Zamora (→ Google Maps)
  - Landline: 980 533 152 (tel: link)
  - Mobile/WhatsApp: 639 980 253
  - Email: hostalsol@outlook.com
  - Hours: Lun–Sáb · 10:00–21:00
- 3 action buttons: phone (980 533 152), WhatsApp (green), Email
- Right: stay info card (6 tiles: Check-in, Check-out, Atención, Domingo=Cerrado, Mascotas, Planta) + mini map embed

#### Footer
- Background: `#15150f`
- Action buttons row (centred): 980 533 152, WhatsApp 639 980 253, Email
- Bottom row: copyright text + links (Términos, Cookies, Parking, FAQ, Check-in, Reservar)
- Copyright: `© {year} Hostal Sol Zamora · Familia hotelera desde 1975 · Todos los derechos reservados`

---

### 6.3 Sub-pages

All sub-pages share the same design system and have:
- Fixed frosted navbar with logo + "← Volver al inicio" + "Reservar" button
- `max-width: 1400px` (Parking/FAQ) or `1100–1200px` (Reserva/CheckIn) centred page

#### `FAQ.html` — Full FAQ

- Search bar (live filter with JS)
- Category tab pills (Todas, Horarios, Habitaciones, Reservas, Llegada, Servicios, Normativa)
- FAQ grouped by category, each group with title + accordion items
- 10+ questions per category (40+ items total in ES)
- Info grid at bottom (check-in, check-out, hours, location, pets, payment)

**All FAQ questions (ES):**
1. ¿Cuál es el horario del hostal? — 10–21h, check-in 14–21h
2. ¿Se admiten mascotas? — Sí, pet friendly, consultar disponibilidad (+6€/noche)
3. ¿Puedo hacer el check-in fuera de horario? — 14–21h, equipaje guardado, llaves no antes 13h
4. ¿Hasta qué hora puedo estar en la habitación? — Check-out 11:00h
5. ¿Tenéis ascensor? — Sí, 3ª planta, 2 ascensores
6. ¿Qué documentación debo presentar? — DNI/pasaporte mayores 14 años (R.D. 933/2021)
7. ¿Cómo puedo cancelar? — Gratuita hasta 48h, luego 1ª noche
8. ¿Dónde puedo guardar la bici? — En habitación si limpia, ascensor pequeño
9. ¿Se puede fumar? — Prohibido, multa 100–1.000€
10. ¿Qué métodos de pago? — Efectivo, tarjeta (no AmEx), transferencia >1 semana

#### `Parking.html` — Full Parking Guide

- Hostal address + note about vehicle access via Calle San Miguel for drop-off
- Step-by-step car access guide
- 4 parking options in detail cards (same data as summary section)
- ORA zone info (operating hours, pricing details)
- Night/Sunday free parking map + tips
- Full-width Google Maps embed for each parking option
- Tips for motorcycles

**Tip from design:** "Aunque es zona peatonal, el Ayuntamiento de Zamora permite el acceso en vehículo a los residentes del hostal desde la Calle San Miguel para dejar el equipaje."

#### `Reserva.html` — Booking Engine

- `−15%` discount banner (prominent, top)
- 4 feature chips (same as main page)
- Full `direct-book.com` iframe:
  `https://direct-book.com/properties/hostalsoldirect`
  Height: 720px
- Fallback text below iframe for users having trouble

#### `CheckIn.html` — Arrival Guide + Legal Check-in Docs

- Step-by-step arrival guide:
  1. Navigation apps (Google Maps, Apple Maps, Waze, Bing, OsmAnd)
  2. Access via Calle San Miguel by car
  3. Enter building at Calle Benavente, 2
  4. Take lift to **3rd floor** (2 lifts available)
  5. Ring reception bell / call ahead
- Building access card info
- Legal documentation tables (R.D. 933/2021):
  - DNI/IDESP: número, soporte, caducidad, fecha nacimiento, sexo, nombre, apellidos, nacionalidad
  - Pasaporte/MRZ: número, fecha expedición, fecha caducidad, nacionalidad, nombre, apellidos
  - NIE/TIE: número, soporte, fecha caducidad
  - Permiso conducir: número, apellidos, nombre
- CTA: "Check-in online" button → motor de reservas
- Note: "Al usar el check-in online el proceso es más rápido"
- Google Maps mini embed

---

## 7. Multilanguage System

**12 languages** with browser auto-detection (`navigator.language`) + localStorage persistence (`hsz_lang`):

| Code | Language    | RTL |
|------|-------------|-----|
| `es` | Español     | No  |
| `en` | English     | No  |
| `fr` | Français    | No  |
| `de` | Deutsch     | No  |
| `pt` | Português   | No  |
| `ar` | العربية     | **Yes** |
| `it` | Italiano    | No  |
| `ro` | Română      | No  |
| `pl` | Polski      | No  |
| `ru` | Русский     | No  |
| `zh` | 中文        | No  |
| `ja` | 日本語       | No  |

Each language object has: `lang`, `langName`, `nav`, `hero`, `about`, `rooms`, `videos`, `map`, `parking`, `reviews`, `faq`, `reserve`, `contact`, `footer`.

RTL: Arabic uses `dir="rtl"` on the root `<div>`.

---

## 8. Contact & Business Info

| Field           | Value                                      |
|-----------------|--------------------------------------------|
| Address         | Calle Benavente, 2 — 3ª planta             |
| Postal code     | 49014 Zamora, España                       |
| Landline        | 980 533 152                                |
| Mobile/WA       | 639 980 253                                |
| Email           | hostalsol@outlook.com                      |
| Booking iframe  | https://direct-book.com/properties/hostalsoldirect |
| YouTube channel | https://www.youtube.com/channel/UCMzo7LwahJEbzbt1A5rtC5g |
| YouTube Shorts  | https://www.youtube.com/@HostalSolZamora/shorts |
| Check-in hours  | 14:00 – 21:00                              |
| Check-out       | Until 11:00                                |
| Reception hours | Mon–Sat 10:00–21:00                        |
| **Closed**      | **Sundays**                                |
| Pets surcharge  | +6€ per night per pet                      |
| Direct discount | −15% vs OTAs                               |
| Floor           | 3rd floor, 2 lifts                         |
| Rating          | 7.7/10                             |

---

## 9. History / About Content (Spanish, full)

> "Nuestra historia comienza en **1975**, cuando la familia abrió la **Pensión Padornelo** en la **Calle Aire** de Zamora. Durante muchos años, aquella pensión familiar fue punto de referencia para viajeros que llegaban a la ciudad, ganándose una reputación de trato cercano y habitaciones bien cuidadas.
>
> Con el tiempo, y gracias a las experiencias vividas y a la confianza de tantos huéspedes, la familia evolucionó su negocio: nació el **Hostal Sol** en Calle Benavente, y junto a él el **Restaurante Padornelo**, como homenaje a los orígenes. Más de **50 años de historia hotelera** respaldan cada estancia.
>
> Hoy, con las instalaciones renovadas en estilo nórdico y minimalista, seguimos manteniendo lo que siempre nos ha definido: un trato familiar, habitaciones impecables y el amor por Zamora que nos caracteriza. Estamos en el corazón del casco histórico, a pasos de la Catedral, las iglesias románicas y los mejores rincones gastronómicos."

---

## 10. Guest Reviews (8 real reviews, ES)

| Name              | Stars | Quote (truncated)                                          |
|-------------------|-------|------------------------------------------------------------|
| Gemma             | ★★★★★ | "Me ha encantado la localización, el estilo del hostal es muy moderno…" |
| Iker Zulueta      | ★★★★★ | "En pleno centro histórico, habitaciones amplias, limpias y equipadas…" |
| José Manuel Serrano | ★★★★★ | "Ubicación muy céntrica, te evitas el coche…"             |
| Annayara          | ★★★★★ | "Fui con un brazo lesionado y enseguida me ofrecieron cambiar la habitación…" |
| Javier Fidalgo    | ★★★★★ | "El sitio es perfecto. Muy limpio, todo lo necesario…"    |
| Carla Aguilar     | ★★★★★ | "Hostal estupendo en pleno centro. Nos explicaron qué ver…" |
| L. Elisabeth      | ★★★★★ | "Limpio, cómodo y práctico. Personal atento…"             |
| Juan Manuel       | ★★★★★ | "El WiFi funcionó perfectamente y pude trabajar sin problemas…" |

---

## 11. Restaurante Padornelo

- Name: Restaurante Padornelo
- Description: Traditional Zamorana cuisine, tapas, raciones, stews, D.O. Toro wines
- Distance: ~2 minutes walk from hostal
- Named after the original family pension (1975)
- Google Maps: `https://www.google.com/maps/search/Restaurante+Padornelo+Zamora`
- Photo carousel (4 Google Maps photos, 3s interval, with icon fallback on error)

---

## 12. Navigation App Links

| App         | URL                                                                            |
|-------------|--------------------------------------------------------------------------------|
| Google Maps | `https://www.google.com/maps/dir//Calle+Benavente,+2,+49014+Zamora`            |
| Apple Maps  | `https://maps.apple.com/?address=Calle+Benavente,2,49014+Zamora,Espa%C3%B1a&ll=41.5065,-5.7450&q=Hostal+Sol+Zamora` |
| Waze        | `https://waze.com/ul?ll=41.5065,-5.7450&navigate=yes&q=Hostal+Sol+Zamora`     |
| Bing Maps   | `https://www.bing.com/maps?q=Calle+Benavente+2+49014+Zamora&lvl=17`           |

Coordinates: **41.5065, -5.7450**

---

## 13. Known TODOs / Limitations to Flag

| Item | Status | Notes |
|------|--------|-------|
| YouTube Short IDs per room | Placeholder (`dQw4w9WgXcQ`) | Need real IDs from channel |
| Restaurante Padornelo photos | Google Maps CDN URLs (may break) | Best to host locally |
| Hero photos | Served from existing WP install | Will work if domain stays live |
| Google Maps embed | No API key (uses embed mode) | Fine for prototype; production may need API key |
| Check-in online link | Points to booking engine | If using Chekin/Lodgify, swap URL |
| SEO | Missing `og:image`, `og:description`, `schema.org/LodgingBusiness` | Add for production |
| React/Babel | CDN dev builds | Bundle for production |

---

## 14. Implementation Tech Decision

The prototype uses **React 18 + Babel in-browser** (no build step). The implementation target should be:

- **Static HTML/CSS/JS** (if no build tooling) — convert JSX to plain JS or precompile
- **React + Vite** (recommended for production) — bundle properly, no runtime Babel
- **Vue / other** — fine, match visual output pixel-perfectly

The i18n system is a plain JS object (`window.TRANSLATIONS`). In production, use `react-i18next` or equivalent.

---

*End of design brief. Proceed to implementation.*
