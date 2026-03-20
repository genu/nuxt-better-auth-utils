import {
  defineNuxtModule,
  addServerHandler,
  addTemplate,
  addImports,
  addServerImports,
  addPlugin,
  addRouteMiddleware,
  createResolver,
} from "@nuxt/kit"
import { existsSync } from "node:fs"
import { join } from "node:path"
import type { BetterAuthModuleOptions } from "./types"

export default defineNuxtModule<BetterAuthModuleOptions>({
  meta: {
    name: "better-auth-utils",
    configKey: "betterAuthUtils",
  },
  defaults: {
    configPath: "~~/",
    redirectTo: "/auth/sign-in",
    handlerRoute: "/api/auth/**",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const configDir = options.configPath!
    const serverConfigAlias = `${configDir}auth.server.config`
    const clientConfigAlias = `${configDir}auth.client.config`

    // Resolve actual file paths to check existence
    const resolveAlias = (alias: string) => alias.replace("~~/", `${nuxt.options.rootDir}/`) + ".ts"
    const hasServerConfig = existsSync(resolveAlias(serverConfigAlias))
    const hasClientConfig = existsSync(resolveAlias(clientConfigAlias))

    // Build dir paths for generated files
    const buildDir = nuxt.options.buildDir
    const serverAuthPath = join(buildDir, "better-auth-utils/server/utils/auth")

    // --- Server: catch-all API handler ---
    addServerHandler({
      route: options.handlerRoute!,
      handler: resolve("./runtime/server/handler"),
    })

    // --- Server: useServerAuth() utility ---
    addTemplate({
      filename: "better-auth-utils/server/utils/auth.ts",
      write: true,
      getContents: () => generateServerAuth(serverConfigAlias, hasServerConfig),
    })

    addServerImports([
      { name: "useServerAuth", from: serverAuthPath },
      { name: "AuthInstance", type: true, from: serverAuthPath },
    ])

    // --- Client: useAuth() composable ---
    addTemplate({
      filename: "better-auth-utils/composables/useAuth.ts",
      write: true,
      getContents: () => generateUseAuth(clientConfigAlias, hasClientConfig),
    })

    addImports([{ name: "useAuth", from: join(buildDir, "better-auth-utils/composables/useAuth") }])

    // --- SSR Plugin ---
    addPlugin({
      src: resolve("./runtime/plugins/auth.server.ts"),
      mode: "server",
    })

    // --- Route Middleware ---
    addTemplate({
      filename: "better-auth-utils/middleware/auth.ts",
      write: true,
      getContents: () => generateAuthMiddleware(options.redirectTo!),
    })

    addRouteMiddleware({
      name: "auth",
      path: join(buildDir, "better-auth-utils/middleware/auth"),
    })

    // --- Alias for user config imports ---
    nuxt.options.alias["#better-auth-utils"] = resolve("./types")
  },
})

// --- Template generators ---

function generateServerAuth(serverConfigAlias: string, hasServerConfig: boolean): string {
  const imports = ['import type { H3Event } from "h3"', 'import { betterAuth } from "better-auth"']

  if (hasServerConfig) {
    imports.push(`import serverConfig from "${serverConfigAlias}"`)
  }

  const createBody = hasServerConfig
    ? [
        '  const resolved = typeof serverConfig === "function" ? serverConfig() : serverConfig',
        "  return betterAuth({ ...resolved, secret })",
      ].join("\n")
    : "  return betterAuth({ secret })"

  return [
    ...imports,
    "",
    "function createBetterAuthInstance() {",
    '  const { secret } = useRuntimeConfig()',
    "",
    createBody,
    "}",
    "",
    "export type AuthInstance = ReturnType<typeof createBetterAuthInstance>",
    "",
    "let _instance: AuthInstance | null = null",
    "",
    "function getInstance() {",
    "  if (!_instance) _instance = createBetterAuthInstance()",
    "  return _instance",
    "}",
    "",
    "export function useServerAuth() {",
    "  const requireSession = async (event: H3Event) => {",
    "    const session = await getInstance().api.getSession({ headers: event.headers })",
    "",
    "    if (!session) {",
    "      throw createError({",
    "        statusCode: 401,",
    '        statusMessage: "Unauthorized",',
    "      })",
    "    }",
    "",
    "    return session",
    "  }",
    "",
    "  const getSession = async (event: H3Event) => {",
    "    return await getInstance().api.getSession({ headers: event.headers })",
    "  }",
    "",
    "  return {",
    "    auth: getInstance(),",
    "    requireSession,",
    "    getSession,",
    "  }",
    "}",
  ].join("\n")
}

function generateUseAuth(clientConfigAlias: string, hasClientConfig: boolean): string {
  const configRef = hasClientConfig ? "clientConfig" : "{}"

  return `import { createAuthClient } from "better-auth/client"
import { customSessionClient } from "better-auth/client/plugins"
import type { AuthInstance } from "#build/better-auth-utils/server/utils/auth"
${hasClientConfig ? `import clientConfig from "${clientConfigAlias}"` : ""}

export const useAuth = () => {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers: {
        ...headers,
      },
    },
    plugins: [
      customSessionClient<AuthInstance>(),
      ...((${configRef}).plugins || []),
    ],
    ...Object.fromEntries(
      Object.entries(${configRef}).filter(([key]) => key !== "plugins"),
    ),
  })

  type Session = (typeof client.$Infer.Session)["session"]
  type User = (typeof client.$Infer.Session)["user"]

  const session = useState<Session | null>("auth:session", () => null)
  const user = useState<User | null>("auth:user", () => null)
  const loggedIn = computed(() => !!session.value)

  const fetch = async () => {
    const { data: sessionData } = await client.getSession({
      fetchOptions: {
        headers,
      },
    })

    if (!sessionData) return null

    session.value = sessionData.session || null
    user.value = sessionData.user || null

    return sessionData
  }

  const signOut = async ({ redirectTo }: { redirectTo?: Parameters<typeof navigateTo>[0] } = {}) => {
    const { data, error } = await client.signOut()
    if (error) throw error
    session.value = null
    user.value = null
    if (redirectTo) await navigateTo(redirectTo)
    return data.success
  }

  if (import.meta.client) {
    client.$store.listen("$sessionSignal", async (signal) => {
      if (!signal) return
      await fetch()
    })
  }

  return {
    session,
    user,
    loggedIn,
    fetch,
    signOut,
    client,
  }
}`
}

function generateAuthMiddleware(redirectTo: string): string {
  return `export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useAuth()

  if (!loggedIn.value) {
    return navigateTo("${redirectTo}")
  }
})`
}
