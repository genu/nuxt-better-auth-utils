import { defineNuxtPlugin } from "#app"
import { useAuth } from "#imports"

export default defineNuxtPlugin({
  name: "better-auth-utils",
  enforce: "pre",
  async setup() {
    if (import.meta.prerender) return
    const { fetch } = useAuth()
    await fetch()
  },
})
