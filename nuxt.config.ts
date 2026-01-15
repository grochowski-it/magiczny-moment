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
    'nuxt-studio',
    '@nuxt/image'
  ],
  studio: {
    repository: {
      provider: 'github',
      owner: 'magiczny-moment',
      repo: 'magiczny-moment',
      branch: 'gh-pages' // Optional, defaults to 'main'
    }
  },
  routeRules: {
    '/': { prerender: true }
  },
  site: { url: 'https://mm-event.pl' },
  sitemap: {
    hostname: 'https://mm-event.pl',
    gzip: true,
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
})