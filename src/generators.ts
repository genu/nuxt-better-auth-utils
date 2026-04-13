/**
 * Template generators for the Better Auth Nuxt module.
 * These produce the source code for auto-generated files (server utils, composables, middleware).
 */

export function generateServerAuth(
  serverConfigAlias: string,
  hasServerConfig: boolean,
): string {
  const imports = hasServerConfig
    ? [
        'import { betterAuth } from "better-auth"',
        'import { useRuntimeConfig, createError } from "#imports"',
        `import serverConfig from "${serverConfigAlias}"`,
      ].join("\n")
    : [
        'import { betterAuth } from "better-auth"',
        'import { useRuntimeConfig, createError } from "#imports"',
      ].join("\n");

  const createBody = hasServerConfig
    ? [
        "  const resolved = serverConfig()",
        "  return betterAuth({ ...resolved, secret })",
      ].join("\n")
    : "  return betterAuth({ secret })";

  return `${imports}

function createInstance() {
  const { secret } = useRuntimeConfig()

${createBody}
}

let _instance = null

function getInstance() {
  if (!_instance) _instance = createInstance()
  return _instance
}

export function useServerAuth() {
  const requireSession = async (event) => {
    const session = await getInstance().api.getSession({ headers: event.headers })

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      })
    }

    return session
  }

  const getSession = async (event) => {
    return await getInstance().api.getSession({ headers: event.headers })
  }

  return {
    auth: getInstance(),
    requireSession,
    getSession,
  }
}

`;
}

export function generateServerAuthTypes(
  serverConfigAlias: string,
  hasServerConfig: boolean,
): string {
  const authType = hasServerConfig
    ? [
        'import type { Auth as BetterAuth } from "better-auth"',
        `import type serverConfig from "${serverConfigAlias}"`,
        "type ServerConfig = ReturnType<typeof serverConfig>",
        "type AuthInstance = BetterAuth<ServerConfig & { secret: string }>",
      ].join("\n")
    : [
        'import type { betterAuth } from "better-auth"',
        "type AuthInstance = ReturnType<typeof betterAuth>",
      ].join("\n")

  return `import type { H3Event } from "h3"
${authType}

export type Auth = AuthInstance

export function useServerAuth(): {
  auth: AuthInstance
  requireSession: (event: H3Event) => Promise<NonNullable<AuthInstance["$Infer"]["Session"]>>
  getSession: (event: H3Event) => Promise<AuthInstance["$Infer"]["Session"] | null>
}
`;
}

export function generateUseAuth(
  clientConfigAlias: string,
  hasClientConfig: boolean,
): string {
  const configRef = hasClientConfig ? "clientConfig" : "{}";

  return `import { createAuthClient } from "better-auth/client"
import { defu } from "defu"
${hasClientConfig ? `import clientConfig from "${clientConfigAlias}"` : ""}

export const useAuth = () => {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const client = createAuthClient(defu(${configRef}, {
    baseURL: url.origin,
    fetchOptions: {
      headers: { ...headers },
    },
  }))

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
}`;
}

export function generateAuthMiddleware(redirectTo: string): string {
  return `export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useAuth()

  if (!loggedIn.value) {
    return navigateTo("${redirectTo}")
  }
})
`;
}
