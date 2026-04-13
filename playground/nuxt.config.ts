export default defineNuxtConfig({
  modules: ["../src/module"],

  runtimeConfig: {
    secret: "playground-secret-do-not-use-in-production",
  },

  routeRules: {
    "/spa": { ssr: false },
  },

  betterAuthUtils: {
    redirectTo: "/login",
  },
})
