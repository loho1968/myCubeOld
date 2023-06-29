// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
// @ts-ignore
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        // <script src="https://myawesome-lib.js"></script>
        { src: '/static/js/jquery.min.js' },
        { src: '/static/js/roofpig_and_three.min.js' },
        { src: '/static/js/three.min.js' },
      ],
      link: [
        // <link rel="stylesheet" href="https://myawesome-lib.css">
        { rel: 'stylesheet', href: '/static/css/cube.css' }
      ],
    },
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
  devtools: {enabled: true},
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'css',
    themes: ['dark'],
  }, modules: [
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@element-plus/nuxt',
  ], pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
