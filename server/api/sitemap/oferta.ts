import { queryCollection } from '@nuxt/content/server'
import type { SitemapUrlInput } from '@nuxtjs/sitemap'

export default defineEventHandler(async (event) => {
  const offers = await queryCollection(event, 'oferta').all()
  return offers.map((offer) => {
    return {
      loc: offer.path,
      lastmod: new Date().toISOString()
    } satisfies SitemapUrlInput
  })
})
