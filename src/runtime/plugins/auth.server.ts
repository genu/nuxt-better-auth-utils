export default defineNuxtPlugin({
  name: "better-auth-utils",
  enforce: "pre",
  async setup() {
    const { fetch } = useAuth()
    await fetch()
  },
})
