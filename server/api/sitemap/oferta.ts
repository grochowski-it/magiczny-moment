import { queryCollection } from '@nuxt/content/server'
import { defineSitemapEventHandler } from '#sitemap/server'

export default defineSitemapEventHandler(async (event) => {
  const offers = await queryCollection(event, 'oferta').all()
  return offers.map((offer) => ({
    loc: offer.path,
    lastmod: new Date().toISOString()
  }))
})
