// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  vite: {
    server: {
      proxy: {
        '/api': {
          // target: 'https://oneum.io',
          target: 'http://localhost:3005',
          changeOrigin: true,
          rewrite: (path) => path.replace('/api', ''),
        }
      },
    },
  },
})