// Slug of one FAQ item in every locale, e.g. /api/faq-slugs/27 →
// { es: 'puedo-acceder-despues-de-las-21-00', en: 'can-i-access-...' }.
// The map is built in nuxt.config.ts; only the requested item reaches the
// page payload instead of every slug of every locale.
export default defineEventHandler((event) => {
  const index = Number(getRouterParam(event, 'index'))
  const faqSlugs = useRuntimeConfig(event).faqSlugs as Record<string, string[]>
  const slugs: Record<string, string> = {}
  for (const [locale, list] of Object.entries(faqSlugs)) {
    if (list[index]) slugs[locale] = list[index]
  }
  if (!Object.keys(slugs).length) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }
  return slugs
})
