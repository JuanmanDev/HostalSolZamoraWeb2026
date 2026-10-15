/**
 * usePrerenderImages — make `nuxi generate` emit IPX variants for images that
 * are only rendered on the client (hero slides after the first, gallery
 * slides outside the active window, lightbox).
 *
 * The site is served as static files, so /_ipx/* only exists for URLs that
 * appeared in prerendered HTML. NuxtImg/NuxtPicture register their own URLs
 * when they render on the server; this does the same for images that don't.
 *
 * Each variant must use exactly the props the component uses at runtime
 * (sizes, densities, width/height, format, modifiers) so the URLs match.
 */
import { appendHeader } from 'h3'

export interface ImageVariant {
  sizes?: string
  densities?: string
  width?: number
  height?: number
  format?: string
  modifiers?: Record<string, unknown>
  /** NuxtImg/NuxtPicture `placeholder` prop as [width, height, quality, blur] */
  placeholder?: [number, number?, number?, number?]
}

export function usePrerenderImages(paths: string[], variants: ImageVariant[]) {
  if (!import.meta.server || !import.meta.prerender) return
  const event = useRequestEvent()
  if (!event) return

  const img = useImage()
  const urls = new Set<string>()

  for (const src of paths) {
    for (const v of variants) {
      // Same key order as @nuxt/image's useImageProps: IPX URLs keep the
      // modifier order, so any difference produces a different file name.
      const modifiers = {
        ...v.modifiers,
        width: v.width,
        height: v.height,
        format: v.format,
        quality: img.options.quality,
        background: undefined,
        fit: undefined,
      }
      const { src: main, srcset } = img.getSizes(src, { sizes: v.sizes, densities: v.densities, modifiers })
      urls.add(main)
      for (const entry of srcset.split(', ')) urls.add(entry.trim().split(' ')[0]!)

      if (v.placeholder) {
        const [width = 10, height = width, quality = 50, blur = 3] = v.placeholder
        urls.add(img(src, { ...modifiers, width, height, quality, blur }))
      }
    }
  }

  const ipx = [...urls].filter(u => u && u.includes('/_ipx/'))
  if (ipx.length) {
    appendHeader(event, 'x-nitro-prerender', ipx.map(u => encodeURIComponent(u)).join(', '))
  }
}
