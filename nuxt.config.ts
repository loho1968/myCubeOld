// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
// @ts-ignore
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { src: "js/jquery-3.7.0.min.js" },
        { src: "js/roofpig_and_three.min.js" },
      ],
    },
  },
  css: ["~/assets/css/tailwind.css", "video.js/dist/video-js.css"],
  devtools: { enabled: true },
  elementPlus: {
    icon: "ElIcon",
    importStyle: "css",
    themes: ["dark"],
  },
  ssr: false,
  modules: [
    "dayjs-nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@element-plus/nuxt",
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
});
