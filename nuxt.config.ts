// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    'nuxt-viewport',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-studio'
  ],

  routeRules: {
    '/': { prerender: true }
  },
  // Koniecznie ustaw hostname dla poprawnych URL-i w sitemapie
  site: { url: 'https://mm-event.pl' },
  sitemap: {
    hostname: 'https://mm-event.pl',
    gzip: true,
    autoLastmod: true,
    sources: [
      '/api/sitemap/oferta'
    ]
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
    format: ['webp'],
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
  compatibilityDate: '2024-11-10',
  studio: {
    enabled: true,
    repository: {
      owner: 'grochowski-it',
      repo: 'magiczny-moment',
      branch: 'master',
      provider: 'github'
    }
  }
})
