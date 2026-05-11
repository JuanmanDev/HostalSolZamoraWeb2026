import Fuse from 'fuse.js'

export interface SearchResult {
  title: string
  description: string
  route: string
  category: string
}

const INDEX: SearchResult[] = [
  // Pages
  { title: 'Inicio', description: 'Página principal del Hostal Sol Zamora', route: '/', category: 'Página' },
  { title: 'Galería de habitaciones', description: 'Fotos y vídeos de todas las habitaciones', route: '/galeria', category: 'Galería' },
  { title: 'Reservar habitación', description: 'Reserva tu estancia con 15% de descuento directo', route: '/reserva', category: 'Reservas' },
  { title: 'Guía de aparcamiento', description: 'Opciones de parking cerca del hostal en Zamora', route: '/parking', category: 'Página' },
  { title: 'Check-in online', description: 'Proceso de entrada, llegada y normas de la casa', route: '/checkin', category: 'Página' },
  { title: 'Preguntas frecuentes', description: 'Respuestas a las dudas más comunes de los huéspedes', route: '/faq', category: 'Página' },
  { title: 'Términos y condiciones', description: 'Condiciones de uso y contratación del hostal', route: '/terminos-y-condiciones', category: 'Legal' },
  { title: 'Política de cookies', description: 'Información sobre las cookies usadas en el sitio', route: '/politica-de-cookies-ue', category: 'Legal' },

  // Rooms — link to gallery with room filter
  { title: 'Habitación 301', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=301', category: 'Habitación' },
  { title: 'Habitación 302', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=302', category: 'Habitación' },
  { title: 'Habitación 303', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=303', category: 'Habitación' },
  { title: 'Habitación 304', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=304', category: 'Habitación' },
  { title: 'Habitación 305', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=305', category: 'Habitación' },
  { title: 'Habitación 306', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=306', category: 'Habitación' },
  { title: 'Habitación 307', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=307', category: 'Habitación' },
  { title: 'Habitación 308', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=308', category: 'Habitación' },
  { title: 'Habitación 309', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=309', category: 'Habitación' },
  { title: 'Habitación 310', description: 'Habitación triple con baño privado, planta 3', route: '/galeria?room=310', category: 'Habitación' },
  { title: 'Habitación 311', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=311', category: 'Habitación' },
  { title: 'Habitación 312', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=312', category: 'Habitación' },
  { title: 'Habitación 321', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=321', category: 'Habitación' },
  { title: 'Habitación 322', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=322', category: 'Habitación' },
  { title: 'Habitación 323', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=323', category: 'Habitación' },
  { title: 'Habitación 324', description: 'Habitación con baño privado, planta 3', route: '/galeria?room=324', category: 'Habitación' },
  { title: 'Entrada / Recepción', description: 'Fotos de la recepción y zonas comunes', route: '/galeria?room=Entrada', category: 'Habitación' },

  // FAQ topics — link with ?q= param so page pre-filters
  { title: 'Horario de check-in', description: 'El check-in es a partir de las 14:00 h', route: '/faq?q=check-in', category: 'Dudas' },
  { title: 'Horario de check-out', description: 'El check-out es antes de las 12:00 h', route: '/faq?q=check-out', category: 'Dudas' },
  { title: 'Wifi gratuito', description: 'El hostal dispone de wifi gratuito en todas las habitaciones', route: '/faq?q=wifi', category: 'Dudas' },
  { title: 'Mascotas', description: 'Se admiten mascotas de pequeño tamaño con suplemento', route: '/faq?q=mascota', category: 'Dudas' },
  { title: 'Cancelación gratuita', description: 'Cancelación sin cargo hasta 48h antes de la llegada', route: '/faq?q=cancelación', category: 'Dudas' },
  { title: 'Desayuno', description: 'Información sobre el desayuno en el hostal', route: '/faq?q=desayuno', category: 'Dudas' },
  { title: 'Aparcamiento parking', description: 'Opciones de aparcamiento cercanas al hostal', route: '/parking', category: 'Dudas' },
  { title: 'Descuento reserva directa', description: '15% de descuento al reservar en nuestra web', route: '/reserva', category: 'Reservas' },
  { title: 'Ascensor', description: 'El hostal dispone de 2 ascensores hasta la 3ª planta', route: '/faq?q=ascensor', category: 'Dudas' },
  { title: 'Aire acondicionado', description: 'Todas las habitaciones tienen aire acondicionado', route: '/faq?q=aire', category: 'Dudas' },
  { title: 'Cómo llegar', description: 'Calle Benavente 2, 3ª planta, 49014 Zamora', route: '/#map', category: 'Ubicación' },
  { title: 'Dirección del hostal', description: 'Calle Benavente 2, 3ª planta, 49014 Zamora', route: '/#map', category: 'Ubicación' },
  { title: 'Teléfono contacto', description: '+34 980 533 152', route: '/#contact', category: 'Contacto' },
  { title: 'WhatsApp', description: '+34 639 980 253', route: '/#contact', category: 'Contacto' },
  { title: 'Email', description: 'hostalsol@outlook.com', route: '/#contact', category: 'Contacto' },
]

const fuse = new Fuse(INDEX, {
  keys: ['title', 'description', 'category'],
  threshold: 0.4,
  minMatchCharLength: 2,
})

export function useSearch() {
  function search(query: string): SearchResult[] {
    if (!query.trim() || query.length < 2) return []
    return fuse.search(query, { limit: 6 }).map(r => r.item)
  }

  return { search }
}
