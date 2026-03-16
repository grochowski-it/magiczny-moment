import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '*.md',
    }),
    oferta: defineCollection({
      type: 'page',
      source: 'oferta/*.md',
      schema: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        price: z.string().optional(),
        image: z.string().optional()
      })
    })
  }
})
