export function slugify(text: string): string {
  if (!text) return ''
  const ascii = text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[¿¡?,()'"\.!]/g, '') // Remove specific punctuation marks often found in questions
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
  // Latin-script text keeps the ASCII slug. Other scripts (ar, el, ja, ko, ru,
  // uk, zh) would reduce to '' or to fragments like "21-00", so keep their letters
  if (!/(?!\p{Script=Latin})\p{L}/u.test(text)) return ascii
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}
