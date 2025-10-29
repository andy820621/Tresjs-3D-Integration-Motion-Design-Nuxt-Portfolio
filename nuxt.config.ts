// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxtjs/color-mode', '@nuxtjs/fontaine', '@nuxt/image', '@vueuse/motion/nuxt', '@nuxt/icon', '@tresjs/nuxt'],
  plugins: ['~/plugins/rollbar.client.ts', '~/plugins/RollbarUser.ts'],
  css: ['~/assets/css/main.css'],
  icon: {
    serverBundle: {
      collections: [
        'fa6-solid',
        // 'fa6-regular',
        // 'fa6-brands',
        'ion',
      ],
    },
  },
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    exposeConfig: true,
    viewer: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
