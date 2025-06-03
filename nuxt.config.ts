// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon', '@nuxt/ui-pro'],
  css: ['~/assets/css/main.css']
})