import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string(),
        h1: z.string().optional(),
        sub: z.string().optional(),
        image: z.string().optional()
      })
    }),
    oferta: defineCollection({
      type: 'page',
      source: 'oferta/*.md', // ścieżka do plików md
      schema: z.object({
        title: z.string(),
        image: z.string(),
        price: z.string(),
        content: z.string().optional()
      })
    })
  }
});