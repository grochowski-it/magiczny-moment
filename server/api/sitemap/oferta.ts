import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { queryCollection } from '@nuxt/content/server'

export default defineSitemapEventHandler(async (e) => {
  // Use Nuxt Content v3 server queryCollection natively
  const offers = await queryCollection(e, 'oferta').all()

  return offers?.map((offer) => {
    return asSitemapUrl({
      loc: offer.path,
      lastmod: new Date(),
    })
  }) || []
})