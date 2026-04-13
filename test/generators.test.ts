import { describe, it, expect } from "vitest"
import { generateServerAuth, generateServerAuthTypes, generateUseAuth, generateAuthMiddleware } from "../src/generators"

describe("generateServerAuth", () => {
  it("generates minimal config when no server config exists", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain('import { betterAuth } from "better-auth"')
    expect(result).not.toContain("import serverConfig")
    expect(result).toContain("return betterAuth({ secret })")
    expect(result).toContain("export function useServerAuth()")
  })

  it("imports and merges server config when it exists", () => {
    const result = generateServerAuth("~~/auth.server.config", true)

    expect(result).toContain('import serverConfig from "~~/auth.server.config"')
    expect(result).toContain("const resolved = serverConfig()")
    expect(result).toContain("return betterAuth({ ...resolved, secret })")
  })

  it("uses the provided config alias path", () => {
    const result = generateServerAuth("~/custom/path/auth.server.config", true)

    expect(result).toContain('import serverConfig from "~/custom/path/auth.server.config"')
  })

  it("generates singleton instance pattern", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain("let _instance")
    expect(result).toContain("function getInstance()")
    expect(result).toContain("if (!_instance) _instance = createInstance()")
  })

  it("generates requireSession that throws 401", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain("const requireSession = async (event")
    expect(result).toContain("statusCode: 401")
    expect(result).toContain('statusMessage: "Unauthorized"')
  })

  it("generates getSession without throwing", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain("const getSession = async (event")
    // getSession should return the result, not throw
    const getSessionBlock = result.slice(result.indexOf("const getSession"))
    const returnBlock = getSessionBlock.slice(0, getSessionBlock.indexOf("return {"))
    expect(returnBlock).not.toContain("throw")
  })

  it("reads secret from runtime config", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain("const { secret } = useRuntimeConfig()")
  })

  it("imports useRuntimeConfig and createError from #imports", () => {
    const result = generateServerAuth("~~/auth.server.config", false)

    expect(result).toContain('import { useRuntimeConfig, createError } from "#imports"')
  })

  it("does not contain TypeScript syntax", () => {
    const result = generateServerAuth("~~/auth.server.config", true)

    expect(result).not.toContain("import type")
    expect(result).not.toContain("export type")
    expect(result).not.toContain(": H3Event")
    expect(result).not.toContain(": ReturnType")
  })
})

describe("generateServerAuthTypes", () => {
  it("generates type declarations without server config", () => {
    const result = generateServerAuthTypes("~~/auth.server.config", false)

    expect(result).toContain('import type { H3Event } from "h3"')
    expect(result).toContain('import type { betterAuth } from "better-auth"')
    expect(result).toContain("type AuthInstance = ReturnType<typeof betterAuth>")
    expect(result).toContain("export type Auth = AuthInstance")
    expect(result).toContain("export function useServerAuth()")
  })

  it("generates type declarations with server config", () => {
    const result = generateServerAuthTypes("~~/auth.server.config", true)

    expect(result).toContain('import type { Auth as BetterAuth } from "better-auth"')
    expect(result).toContain('import type serverConfig from "~~/auth.server.config"')
    expect(result).toContain("type ServerConfig = ReturnType<typeof serverConfig>")
    expect(result).toContain("type AuthInstance = BetterAuth<ServerConfig & { secret: string }>")
    expect(result).toContain("export type Auth = AuthInstance")
  })

  it("declares useServerAuth return type with requireSession and getSession", () => {
    const result = generateServerAuthTypes("~~/auth.server.config", false)

    expect(result).toContain("requireSession: (event: H3Event)")
    expect(result).toContain("getSession: (event: H3Event)")
  })
})

describe("generateUseAuth", () => {
  it("generates composable without client config", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain('import { createAuthClient } from "better-auth/client"')
    expect(result).toContain('import { defu } from "defu"')
    expect(result).not.toContain("import clientConfig")
    expect(result).toContain("export const useAuth = ()")
  })

  it("imports client config when it exists", () => {
    const result = generateUseAuth("~~/auth.client.config", true)

    expect(result).toContain('import clientConfig from "~~/auth.client.config"')
  })

  it("uses the provided config alias path", () => {
    const result = generateUseAuth("~/custom/auth.client.config", true)

    expect(result).toContain('import clientConfig from "~/custom/auth.client.config"')
  })

  it("uses defu to merge client config with defaults", () => {
    const result = generateUseAuth("~~/auth.client.config", true)

    expect(result).toContain("createAuthClient(defu(clientConfig, {")
    expect(result).toContain("baseURL: url.origin")
    expect(result).toContain("headers: { ...headers }")
  })

  it("uses empty object when no client config", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("createAuthClient(defu({}, {")
  })

  it("generates reactive session state", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain('useState<Session | null>("auth:session", () => null)')
    expect(result).toContain('useState<User | null>("auth:user", () => null)')
    expect(result).toContain("const loggedIn = computed(() => !!session.value)")
  })

  it("generates fetch function that updates state", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("const fetch = ()")
    expect(result).toContain("session.value = sessionData.session || null")
    expect(result).toContain("user.value = sessionData.user || null")
  })

  it("deduplicates concurrent fetch calls", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("let _fetchPromise")
    expect(result).toContain("if (_fetchPromise) return _fetchPromise")
    expect(result).toContain("_fetchPromise = null")
  })

  it("generates signOut function that clears state", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("const signOut = async")
    expect(result).toContain("session.value = null")
    expect(result).toContain("user.value = null")
  })

  it("includes cross-tab session signal listener", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("if (import.meta.client)")
    expect(result).toContain('client.$store.listen("$sessionSignal"')
    expect(result).toContain("async (signal: boolean)")
  })

  it("returns all expected properties", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("return {")
    for (const prop of ["session", "user", "loggedIn", "fetch", "signOut", "client"]) {
      expect(result).toContain(prop)
    }
  })

  it("sets baseURL from request URL", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("const url = useRequestURL()")
    expect(result).toContain("baseURL: url.origin")
  })

  it("forwards request headers for SSR", () => {
    const result = generateUseAuth("~~/auth.client.config", false)

    expect(result).toContain("const headers = useRequestHeaders()")
    expect(result).toContain("headers: { ...headers }")
  })
})

describe("generateAuthMiddleware", () => {
  it("generates middleware with default redirect", () => {
    const result = generateAuthMiddleware("/auth/sign-in")

    expect(result).toContain("defineNuxtRouteMiddleware")
    expect(result).toContain('return navigateTo("/auth/sign-in")')
  })

  it("uses custom redirect path", () => {
    const result = generateAuthMiddleware("/login")

    expect(result).toContain('return navigateTo("/login")')
  })

  it("checks loggedIn state from useAuth", () => {
    const result = generateAuthMiddleware("/auth/sign-in")

    expect(result).toContain("const { loggedIn } = useAuth()")
    expect(result).toContain("if (!loggedIn.value)")
  })

  it("only redirects when not logged in", () => {
    const result = generateAuthMiddleware("/auth/sign-in")

    // Should redirect when NOT logged in
    expect(result).toContain("if (!loggedIn.value)")
    // Should not contain an else branch (no action when logged in)
    expect(result).not.toContain("else")
  })
})
