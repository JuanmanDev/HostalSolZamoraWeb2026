import Fuse from 'fuse.js'
import { slugify } from '~/utils/slugify'

export interface SearchResult {
  title: string
  description: string
  route: string
  category: string
  hidden?: string
}

const STOP = new Set([
  'cuál','cual','cómo','como','qué','que','hay','puedo','puede','tienen',
  'tenéis','tiene','son','eres','soy','somos','es','el','la','los','las',
  'un','una','de','del','en','me','mi','tu','su','se','si','he','ha',
  'con','por','para','lo','le','ya','al','más','este','esta','estos',
  'what','how','do','can','is','are','does','have','the','a','an','i',
  'my','you','your','be','to','in','of','and','or','if','at','on',
])

function faqKeyword(rawTags: any[] | undefined, q: string, resolver: (v: any) => string): string {
  if (rawTags && rawTags.length > 0) return resolver(rawTags[0])
  const clean = q.replace(/^[¿¡]/, '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
  const word = clean.split(/\s+/).find(w => w.length > 2 && !STOP.has(w))
  return word ?? clean.split(' ')[0] ?? q
}

export function useSearch() {
  const { tm, rt, t } = useI18n()

  const index = computed<SearchResult[]>(() => {
    const items: SearchResult[] = []

    const cat = {
      page:    t('search.catPage'),
      room:    t('search.catRoom'),
      faq:     t('search.catFaq'),
      parking: t('search.catParking'),
      contact: t('search.catContact'),
      checkin: t('search.catCheckin'),
      about:   t('search.catAbout'),
      booking: t('search.catBooking'),
    }

    // ── Pages ─────────────────────────────────────────────────────────────
    items.push(
      {
        title: t('nav.faq'), description: t('pages.faq.description'),
        route: '/faq', category: cat.faq,
        hidden: 'dudas preguntas questions help ayuda faq frecuentes',
      },
      {
        title: t('nav.rooms'), description: t('pages.galeria.description'),
        route: '/galeria', category: cat.room,
        hidden: 'fotos imagenes habitaciones photos gallery rooms galeria ver',
      },
      {
        title: t('nav.reserve'), description: t('pages.reserva.description'),
        route: '/reserva', category: cat.booking,
        hidden: 'reservar booking book precio price descuento discount 15 directo',
      },
      {
        title: t('nav.parking'), description: t('pages.parking.description'),
        route: '/parking', category: cat.parking,
        hidden: 'aparcar coche moto garaje park car parking gratis gratuito estacionar',
      },
      {
        title: t('nav.checkin'), description: t('pages.checkin.description'),
        route: '/checkin', category: cat.checkin,
        hidden: 'llegada arrival documentacion docs dni pasaporte como llegar entrada check in',
      },
      {
        title: t('nav.about'), description: t('pages.sobreNosotros.description'),
        route: '/sobre-nosotros', category: cat.about,
        hidden: 'historia history about nosotros familia family 1975 hosteleria hostal zamora',
      },
      {
        title: t('nav.contact'), description: t('pages.contacto.description'),
        route: '/contacto', category: cat.contact,
        hidden: 'contacto contact telefono phone email formulario form mensaje write',
      },
      {
        title: t('nav.home'), description: t('pages.home.description'),
        route: '/', category: cat.page,
        hidden: 'hostal sol zamora inicio home principal',
      },
    )

    // ── Contact quick-access ──────────────────────────────────────────────
    items.push(
      {
        title: '+34 980 533 152', description: t('faq.callLabel'),
        route: 'tel:+34980533152', category: cat.contact,
        hidden: 'telefono llamar phone call 980533152 hostal',
      },
      {
        title: '+34 639 980 253', description: t('faq.waLabel'),
        route: 'https://wa.me/34639980253', category: cat.contact,
        hidden: 'whatsapp mensaje message 639980253 wa chat',
      },
      {
        title: 'hostalsol@outlook.com', description: t('faq.emailLabel'),
        route: 'mailto:hostalsol@outlook.com', category: cat.contact,
        hidden: 'email correo mail hostalsol outlook escribir write',
      },
      {
        title: t('map.title'), description: t('map.address'),
        route: '/#map', category: cat.contact,
        hidden: 'direccion address ubicacion location mapa map calle benavente zamora 49014 como llegar',
      },
    )

    // ── Room types ────────────────────────────────────────────────────────
    try {
      const roomTypes = tm('rooms.types') as any[]
      roomTypes.forEach((item: any) => {
        const label  = rt(item.label)
        const extras = (item.extras as any[] | undefined)?.map((e: any) => rt(e)).join(' · ') ?? ''
        items.push({
          title: label, description: extras,
          route: '/galeria', category: cat.room,
          hidden: `${label.toLowerCase()} habitacion room tipo balcon balcony twin doble double matrimonio individual`,
        })
      })
    } catch (_) {}

    // Individual room numbers
    ;['301','302','303','304','305','306','307','308','309','310','311','312','321','322','323','324'].forEach(n => {
      items.push({
        title: `${t('search.room')} ${n}`,
        description: t('search.roomDesc'),
        route: `/galeria?room=${n}`,
        category: cat.room,
        hidden: `habitacion room numero number ${n} baño privado`,
      })
    })
    items.push({
      title: t('search.entrance'), description: t('pages.galeria.description'),
      route: '/galeria?room=Entrada', category: cat.room,
      hidden: 'entrada reception recepcion zonas comunes common areas pasillo',
    })

    // ── All FAQ items ─────────────────────────────────────────────────────
    try {
      const faqItems = tm('faq.items') as any[]
      faqItems.forEach((item: any) => {
        const q    = rt(item.q)
        const a    = rt(item.a)
        const tags = (item.tags as any[] | undefined)?.map((tag: any) => rt(tag)) ?? []
        const kw   = faqKeyword(item.tags, q, rt)
        const slug = slugify(q)
        items.push({
          title:       q,
          description: a.length > 110 ? a.substring(0, 110) + '…' : a,
          route:       `/faq/${slug}`,
          category:    cat.faq,
          hidden:      `${tags.join(' ')} ${a.substring(0, 200)}`,
        })
      })
    } catch (_) {}

    // ── Parking spots ─────────────────────────────────────────────────────
    try {
      const ss = tm('pages.parking.streetSpots')      as any[]
      const us = tm('pages.parking.undergroundSpots') as any[]
      ;[...ss, ...us].forEach((spot: any) => {
        const name  = rt(spot.name  ?? '')
        const price = rt(spot.price ?? '')
        const walk  = rt(spot.walk  ?? spot.dist ?? '')
        const note  = rt(spot.note  ?? spot.details ?? spot.tip ?? '')
        items.push({
          title:       name,
          description: [price, walk].filter(Boolean).join(' · '),
          route:       '/parking',
          category:    cat.parking,
          hidden:      `parking aparcamiento garaje ${name.toLowerCase()} ${note.substring(0, 80)}`,
        })
      })
    } catch (_) {}

    return items
  })

  const fuse = computed(() => new Fuse<SearchResult>(index.value, {
    keys: [
      { name: 'title',       weight: 3   },
      { name: 'description', weight: 1.5 },
      { name: 'hidden',      weight: 1   },
      { name: 'category',    weight: 0.5 },
    ],
    threshold:          0.35,
    minMatchCharLength: 2,
    ignoreLocation:     true,
    includeScore:       true,
  }))

  function search(query: string): SearchResult[] {
    if (!query.trim() || query.length < 2) return []
    return fuse.value.search(query, { limit: 10 }).map(r => r.item)
  }

  return { search }
}
