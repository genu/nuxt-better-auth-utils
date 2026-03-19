export default defineNuxtPlugin({
  name: "better-auth",
  enforce: "pre",
  async setup() {
    const { fetch } = useAuth()
    await fetch()
  },
})
