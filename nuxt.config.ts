// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    'nuxt-viewport',
    '@nuxt/icon',
    'nuxt-studio',
    'nuxt-ai-ready',
    '@dargmuesli/nuxt-cookie-control',
    '@nuxt/image'
  ],

  // Static site: prerender everything so no @nuxt/content query runs at
  // request time on Vercel serverless (the cause of the broken offer pages).
  routeRules: {
    '/**': { prerender: true }
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true
    }
  },

  site: {
    url: 'https://mm-event.pl',
    name: 'Magiczny Moment Event',
    description: 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane i inne efekty, które sprawią, że Twoje wydarzenie będzie niezapomniane.',
    defaultLocale: 'pl'
  },

  // robots.txt (with AI content-signals) - @nuxtjs/robots v7
  robots: {
    sitemap: 'https://mm-event.pl/sitemap.xml',
    // Allow AI search & citation; block AI training on the content.
    contentSignal: 'ai-train=no, search=yes, ai-use=yes'
  },

  // sitemap.xml - @nuxtjs/sitemap v9
  sitemap: {
    hostname: 'https://mm-event.pl',
    gzip: true,
    sources: [
      '/api/sitemap/oferta'
    ]
  },

  // Schema.org structured data - nuxt-schema-org v7
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      '@type': 'ProfessionalService',
      name: 'Magiczny Moment Event',
      description: 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane i inne efekty eventowe.',
      url: 'https://mm-event.pl',
      logo: '/LOGO.png',
      telephone: '+48602434673',
      email: 'magiczny.event@gmail.com',
      // Address NAP - update with the real business registration details.
      address: {
        addressCountry: 'PL'
      },
      geo: {
        '@type': 'GeoCoordinates',
        // Set to the real business location.
        latitude: 0,
        longitude: 0
      },
      // Service area - set to the real city/region being served.
      areaServed: 'PL',
      priceRange: 'zł',
      openingHoursSpecification: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '20:00'
        }
      ],
    }
  },

  // llms.txt / per-page markdown for LLM discoverability - nuxt-ai-ready v3
  llms: {
    domain: 'https://mm-event.pl',
    title: 'Magiczny Moment Event',
    description: 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane i inne efekty eventowe.',
    sections: [
      {
        title: 'Oferta',
        description: 'Atrakcje na imprezy',
        links: [
          { title: 'Fotobudka 360', href: 'https://mm-event.pl/oferta/fotobudka_360' },
          { title: 'Fotobudka klasyczna', href: 'https://mm-event.pl/oferta/fotobudka_classic' },
          { title: 'Ciężki dym', href: 'https://mm-event.pl/oferta/ciezki_dym' },
          { title: 'Zimne ognie', href: 'https://mm-event.pl/oferta/iskry' },
        ]
      },
      {
        title: 'Informacje',
        links: [
          { title: 'Strona główna', href: 'https://mm-event.pl/' },
          { title: 'Polityka prywatności (RODO)', href: 'https://mm-event.pl/polityka-prywatnosci' },
        ]
      }
    ]
  },

  // Cookie consent (RODO) - @dargmuesli/nuxt-cookie-control v9
  cookieControl: {
    locale: 'pl',
    locales: ['pl'],
    lazy: true,
    blockIframes: true,
    isModal: false,
    barPosition: 'bottom-right',
    cookies: {
      necessary: [
        {
          name: 'Wymagane',
          description: 'Pliki cookies niezbędne do poprawnego działania strony (np. zapisana preferencja zgody).',
          cookies: ['ncc_c', 'ncc_e']
        }
      ],
      analytics: [
        {
          name: 'Analityczne',
          description: 'Pliki cookies używane do anonimowej analizy statystyk odwiedzin. Przetwarzane są wyłącznie po udzieleniu zgody.',
          cookies: []
        }
      ],
      marketing: [
        {
          name: 'Marketingowe',
          description: 'Pliki cookies wykorzystywane do celów marketingowych. Przetwarzane są wyłącznie po udzieleniu zgody.',
          cookies: []
        }
      ]
    },
    text: {
      managerDescription: 'Wybierz, które pliki cookies mogą być używane na tej stronie. Pliki cookies są zapisywane wyłącznie po wyrażeniu zgody. Więcej informacji w Polityce prywatności.',
      acceptAll: 'Akceptuję wszystkie',
      acceptNecessary: 'Tylko niezbędne',
      declineAll: 'Odrzucam wszystkie',
      settings: 'Ustawienia cookies',
      save: 'Zapisz wybór',
      consentRequired: 'Twoja zgoda jest wymagana',
    }
  },

  icon: {
    provider: 'iconify',
    serverBundle: false,
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/icons'
      },
    ],
  },
  image: {
    // Local IPX provider (default ipx). The Vercel provider is applied
    // automatically by the Vercel deployment.
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  },
  fonts: {
    // Self-hosted fonts are served from public/fonts; subsets include Polish
    // diacritics. throwOnError is off because fonts are local static files.
    throwOnError: false,
    defaultOptions: {
      subsets: ['latin', 'latin-ext']
    }
  },
  compatibilityDate: '2024-11-10',
  future: {
    compatibilityVersion: 4,
  },
  studio: {
    repository: {
      provider: 'github',
      owner: 'grochowski-it',
      repo: 'magiczny-moment'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'pl'
      },
      title: 'Magiczny Moment Event — atrakcje na imprezy',
      meta: [
        { name: 'description', content: 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane i inne efekty, które sprawią, że Twoje wydarzenie będzie niezapomniane.' }
      ]
    }
  }
})
