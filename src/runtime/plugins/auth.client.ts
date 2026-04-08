import { defineNuxtPlugin } from "#app"
import { useAuth } from "#imports"

export default defineNuxtPlugin({
  name: "better-auth-utils:client",
  enforce: "pre",
  async setup() {
    const { session, fetch } = useAuth()
    if (!session.value) {
      await fetch()
    }
  },
})
