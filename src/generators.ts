/**
 * Template generators for the Better Auth Nuxt module.
 * These produce the source code for auto-generated files (server utils, composables, middleware).
 */

export function generateServerAuth(serverConfigAlias: string, hasServerConfig: boolean): string {
  const imports = [
    'import { betterAuth } from "better-auth"',
    'import { useRuntimeConfig, createError } from "#imports"',
  ]

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
    "let _instance = null",
    "",
    "function getInstance() {",
    "  if (!_instance) _instance = createBetterAuthInstance()",
    "  return _instance",
    "}",
    "",
    "export function useServerAuth() {",
    "  const requireSession = async (event) => {",
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
    "  const getSession = async (event) => {",
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

export function generateServerAuthTypes(): string {
  return [
    'import type { H3Event } from "h3"',
    'import type { betterAuth } from "better-auth"',
    "",
    "type AuthInstance = ReturnType<typeof betterAuth>",
    "",
    'declare module "#better-auth-utils/server/auth" {',
    "  export type AuthInstance = ReturnType<typeof betterAuth>",
    "",
    "  export function useServerAuth(): {",
    "    auth: AuthInstance",
    "    requireSession: (event: H3Event) => Promise<NonNullable<Awaited<ReturnType<AuthInstance['api']['getSession']>>>>",
    "    getSession: (event: H3Event) => Promise<Awaited<ReturnType<AuthInstance['api']['getSession']>>>",
    "  }",
    "}",
  ].join("\n")
}

export function generateUseAuth(
  clientConfigAlias: string,
  hasClientConfig: boolean,
  serverConfigAlias: string,
  hasServerConfig: boolean,
): string {
  const configRef = hasClientConfig ? "clientConfig" : "{}"

  const authInstanceType = hasServerConfig
    ? [
        `import type serverConfig from "${serverConfigAlias}"`,
        `type ResolvedServerConfig = typeof serverConfig extends (...args: any[]) => infer R ? R : typeof serverConfig`,
        `type AuthInstance = { options: ResolvedServerConfig & { secret: string } }`,
      ].join("\n")
    : [
        `import type { betterAuth } from "better-auth"`,
        `type AuthInstance = ReturnType<typeof betterAuth>`,
      ].join("\n")

  return `import { createAuthClient } from "better-auth/client"
import { customSessionClient } from "better-auth/client/plugins"
${authInstanceType}
${hasClientConfig ? `import clientConfig from "${clientConfigAlias}"` : ""}

export const useAuth = () => {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const client = createAuthClient({
    ...${configRef},
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
  })

  type Session = (typeof client.$Infer.Session)["session"]
  type User = (typeof client.$Infer.Session)["user"]

  const session = useState<Session | null>("auth:session", () => null)
  const user = useState<User | null>("auth:user", () => null)
  const loggedIn = computed(() => !!session.value)
  const ready = useState<boolean>("auth:ready", () => false)

  let _fetchPromise: Promise<typeof client.$Infer.Session | null> | null = null

  const fetch = () => {
    if (_fetchPromise) return _fetchPromise

    _fetchPromise = (async () => {
      try {
        let sessionData: typeof client.$Infer.Session | null = null

        if (import.meta.server) {
          sessionData = await $fetch("/api/auth/get-session", { headers })
        } else {
          const { data } = await client.getSession({
            fetchOptions: {
              headers,
            },
          })
          sessionData = data
        }

        if (!sessionData) return null

        session.value = sessionData.session || null
        user.value = sessionData.user || null

        return sessionData
      } catch {
        return null
      } finally {
        ready.value = true
        _fetchPromise = null
      }
    })()

    return _fetchPromise
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
    client.$store.listen("$sessionSignal", async (signal: boolean) => {
      if (!signal) return
      await fetch()
    })
  }

  return {
    session,
    user,
    loggedIn,
    ready,
    fetch,
    signOut,
    client,
  }
}`
}

export function generateAuthMiddleware(redirectTo: string): string {
  return `export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useAuth()

  if (!loggedIn.value) {
    return navigateTo("${redirectTo}")
  }
})`
}
