import { describe, it, expect, beforeAll } from "vitest"
import { loadNuxt } from "@nuxt/kit"
import { fileURLToPath } from "node:url"
import type { Nuxt } from "@nuxt/schema"

async function setupNuxt(
  fixture: string,
  overrides: Record<string, unknown> = {},
): Promise<Nuxt> {
  const rootDir = fileURLToPath(new URL(`./fixtures/${fixture}`, import.meta.url))
  return await loadNuxt({
    cwd: rootDir,
    overrides: {
      _generate: false,
      ...overrides,
    },
    ready: true,
  })
}

function getTemplateContent(nuxt: Nuxt, filename: string): string {
  const templates = nuxt.options.build.templates as Array<{
    filename: string
    getContents: (ctx: unknown) => string
  }>
  const template = templates.find((t) => t.filename === filename)
  if (!template) throw new Error(`Template "${filename}" not found`)
  return template.getContents({ nuxt, app: {} })
}

describe("module setup with defaults", () => {
  let nuxt: Nuxt

  beforeAll(async () => {
    nuxt = await setupNuxt("basic")
  }, 30_000)

  it("registers the server handler at /api/auth/**", () => {
    const handler = nuxt.options.serverHandlers.find(
      (h) => h.route === "/api/auth/**",
    )
    expect(handler).toBeDefined()
    expect(handler!.handler).toContain("runtime/server/handler")
  })

  it("registers the SSR plugin", () => {
    const plugin = nuxt.options.plugins.find((p) => {
      const src = typeof p === "string" ? p : p.src
      return src.includes("auth.server")
    })
    expect(plugin).toBeDefined()
  })

  it("sets #better-auth-utils alias to types", () => {
    expect(nuxt.options.alias["#better-auth-utils"]).toBeDefined()
    expect(nuxt.options.alias["#better-auth-utils"]).toContain("types")
  })

  it("generates useServerAuth template without config import", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/server/utils/auth.ts")

    expect(content).toContain("export function useServerAuth()")
    expect(content).toContain("export type AuthInstance")
    expect(content).toContain("betterAuth({ secret })")
    expect(content).not.toContain("import serverConfig")
  })

  it("generates useAuth composable template without config import", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/composables/useAuth.ts")

    expect(content).toContain("export const useAuth = ()")
    expect(content).toContain("createAuthClient")
    expect(content).toContain("customSessionClient<AuthInstance>()")
    expect(content).not.toContain("import clientConfig")
  })

  it("generates auth middleware with default redirect", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/middleware/auth.ts")

    expect(content).toContain("defineNuxtRouteMiddleware")
    expect(content).toContain('navigateTo("/auth/sign-in")')
  })

  it("registers all three better-auth templates", () => {
    const templates = (nuxt.options.build.templates as Array<{ filename: string }>)
      .filter((t) => t.filename?.startsWith("better-auth-utils/"))
      .map((t) => t.filename)

    expect(templates).toContain("better-auth-utils/server/utils/auth.ts")
    expect(templates).toContain("better-auth-utils/composables/useAuth.ts")
    expect(templates).toContain("better-auth-utils/middleware/auth.ts")
  })
})

describe("module setup with custom options", () => {
  let nuxt: Nuxt

  beforeAll(async () => {
    nuxt = await setupNuxt("basic", {
      betterAuthUtils: {
        redirectTo: "/login",
        handlerRoute: "/api/custom-auth/**",
      },
    })
  }, 30_000)

  it("registers server handler at custom route", () => {
    const handler = nuxt.options.serverHandlers.find(
      (h) => h.route === "/api/custom-auth/**",
    )
    expect(handler).toBeDefined()
  })

  it("does not register handler at default route", () => {
    const handler = nuxt.options.serverHandlers.find(
      (h) => h.route === "/api/auth/**",
    )
    expect(handler).toBeUndefined()
  })

  it("generates middleware with custom redirect", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/middleware/auth.ts")

    expect(content).toContain('navigateTo("/login")')
    expect(content).not.toContain('navigateTo("/auth/sign-in")')
  })
})

describe("module setup with config files", () => {
  let nuxt: Nuxt

  beforeAll(async () => {
    nuxt = await setupNuxt("with-config")
  }, 30_000)

  it("imports server config when auth.server.config.ts exists", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/server/utils/auth.ts")

    expect(content).toContain("import serverConfig")
    expect(content).toContain("betterAuth({ ...resolved, secret })")
  })

  it("supports factory function pattern in generated server config", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/server/utils/auth.ts")

    expect(content).toContain('typeof serverConfig === "function" ? serverConfig() : serverConfig')
  })

  it("imports client config when auth.client.config.ts exists", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/composables/useAuth.ts")

    expect(content).toContain("import clientConfig")
    expect(content).toContain("...((clientConfig).plugins || [])")
  })
})
