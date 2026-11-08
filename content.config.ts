import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { defineSchemaOrgSchema } from 'nuxt-schema-org/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        schemaOrg: defineSchemaOrgSchema(),
        head: z.object({
          meta: z.array(z.record(z.string(), z.any())).optional(),
          script: z.array(z.record(z.string(), z.any())).optional(),
        }).optional(),
      }),
    }),
    oferta: defineCollection({
      type: 'page',
      source: 'oferta/*.md',
      schema: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        price: z.string().optional(),
        image: z.string().optional(),
        schemaOrg: defineSchemaOrgSchema(),
        head: z.object({
          meta: z.array(z.record(z.string(), z.any())).optional(),
          script: z.array(z.record(z.string(), z.any())).optional(),
        }).optional(),
      })
    }),
    legal: defineCollection({
      type: 'page',
      source: 'legal/*.md',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    })
  }
})
