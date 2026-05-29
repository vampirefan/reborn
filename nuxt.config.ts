// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-28',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  i18n: {
    locales: [
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    lazy: true,
    langDir: '../locales',
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/typography.css',
    '~/assets/css/transitions.css',
    '@vue-flow/core/dist/style.css',
    '@vue-flow/core/dist/theme-default.css',
    '@vue-flow/controls/dist/style.css',
    '@vue-flow/minimap/dist/style.css',
  ],

  routeRules: {
    '/admin/**': { ssr: false },
    '/admin': { ssr: false },
  },

  app: {
    head: {
      title: '轮回 Reborn',
      meta: [
        { name: 'description', content: 'A text adventure through history' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
