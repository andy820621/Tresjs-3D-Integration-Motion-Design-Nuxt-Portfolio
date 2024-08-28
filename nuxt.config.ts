// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxtjs/color-mode', '@nuxtjs/fontaine', '@nuxt/image', '@vueuse/motion/nuxt', '@nuxt/icon', '@tresjs/nuxt', 'nuxt-rollbar'],
  // 整合指導 使用 Rollbar 來監控和除錯
  rollbar: {
    serverAccessToken: 'f9696ee296544c1aa7466e5bb0a02684',
    clientAccessToken: 'f9696ee296544c1aa7466e5bb0a02684',
  },
  plugins: ['~/plugins/RollbarUser.ts'],

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
})
