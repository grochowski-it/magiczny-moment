import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  return [
    { loc: '/oferta/banki_mydlane' },
    { loc: '/oferta/ciezki_dym' },
    { loc: '/oferta/fontanny_iskier' },
    { loc: '/oferta/fotobudka_360' },
    { loc: '/oferta/fotobudka_klasyczna' },
    { loc: '/oferta/napis_led' },
    { loc: '/oferta/napis_milosc' },
    { loc: '/oferta/oswietlenie_led' },
    { loc: '/oferta/stelaz_heksagonalny' },
    { loc: '/oferta/wiatraki_iskier' },
    { loc: '/oferta/wystrzaly_dymne' }
  ].map((c) => {
    return asSitemapUrl({
      loc: c.loc,
      lastmod: new Date(),
    })
  })
})
