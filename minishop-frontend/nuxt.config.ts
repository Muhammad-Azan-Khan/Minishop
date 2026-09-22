export default defineNuxtConfig({
  compatibilityDate: "2026-07-01",

  devtools: {
    enabled: true,
  },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vee-validate/nuxt",
  ],

  typescript: {
    tsConfig: {
      compilerOptions: {
        module: "ESNext",
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000",
    },
  },

  devServer: {
    port: 4000,
  },

  app: {
    head: {
      title: "MiniShop",

      htmlAttrs: {
        class: "scroll-smooth",
      },

      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap",
        },
      ],
    },
  },
});