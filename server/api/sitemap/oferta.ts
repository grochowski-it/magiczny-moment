import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async (e) => {
  // Use Nuxt Content v3 serverQueryCollection natively
  const { data: offers } = await serverQueryCollection(e, 'oferta')

  return offers?.map((offer) => {
    return asSitemapUrl({
      loc: offer.path,
      lastmod: new Date(),
    })
  }) || []
})
