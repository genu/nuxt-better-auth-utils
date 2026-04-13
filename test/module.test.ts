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

function getServerTemplateContent(nuxt: Nuxt, filename: string): string {
  const virtual = nuxt.options.nitro.virtual as Record<string, () => string>
  const key = Object.keys(virtual ?? {}).find((k) => k.endsWith(filename))
  if (!key) throw new Error(`Server template "${filename}" not found`)
  return virtual[key]()
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

  it("registers the client plugin", () => {
    const plugin = nuxt.options.plugins.find((p) => {
      const src = typeof p === "string" ? p : p.src
      return src.includes("auth.client")
    })
    expect(plugin).toBeDefined()
  })

  it("sets #nuxt-better-auth-utils alias for type imports", () => {
    expect(nuxt.options.alias["#nuxt-better-auth-utils"]).toBeDefined()
    expect(nuxt.options.alias["#nuxt-better-auth-utils"]).toContain("better-auth-utils/server/auth")
  })

  it("generates useServerAuth server template without config import", () => {
    const content = getServerTemplateContent(nuxt, "better-auth-utils/server/auth")

    expect(content).toContain("export function useServerAuth()")
    expect(content).toContain("betterAuth({ secret })")
    expect(content).not.toContain("import serverConfig")
  })

  it("generates server auth without TypeScript syntax", () => {
    const content = getServerTemplateContent(nuxt, "better-auth-utils/server/auth")

    expect(content).not.toContain("import type")
    expect(content).not.toContain("export type")
  })

  it("generates useAuth composable template without config import", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/composables/useAuth.ts")

    expect(content).toContain("export const useAuth = ()")
    expect(content).toContain("createAuthClient")
    expect(content).toContain('import { defu } from "defu"')
    expect(content).not.toContain("import clientConfig")
  })

  it("generates auth middleware with default redirect", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/middleware/auth.ts")

    expect(content).toContain("defineNuxtRouteMiddleware")
    expect(content).toContain('navigateTo("/auth/sign-in")')
  })

  it("registers AuthUserButton component", async () => {
    const collected: Array<{ pascalName?: string }> = []
    await nuxt.callHook("components:extend", collected as never)
    const component = collected.find((c) => c.pascalName === "AuthUserButton")
    expect(component).toBeDefined()
  })

  it("registers AuthTeamSwitcher component", async () => {
    const collected: Array<{ pascalName?: string }> = []
    await nuxt.callHook("components:extend", collected as never)
    const component = collected.find((c) => c.pascalName === "AuthTeamSwitcher")
    expect(component).toBeDefined()
  })

  it("registers client-side templates", () => {
    const templates = (nuxt.options.build.templates as Array<{ filename: string }>)
      .filter((t) => t.filename?.startsWith("better-auth-utils/"))
      .map((t) => t.filename)

    expect(templates).toContain("better-auth-utils/composables/useAuth.ts")
    expect(templates).toContain("better-auth-utils/middleware/auth.ts")
    expect(templates).toContain("better-auth-utils/server/auth.d.ts")
  })

  it("registers server auth as a nitro virtual module", () => {
    const virtual = nuxt.options.nitro.virtual as Record<string, unknown>
    const key = Object.keys(virtual ?? {}).find((k) => k.endsWith("better-auth-utils/server/auth"))
    expect(key).toBeDefined()
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
    const content = getServerTemplateContent(nuxt, "better-auth-utils/server/auth")

    expect(content).toContain("import serverConfig")
    expect(content).toContain("betterAuth({ ...resolved, secret })")
  })

  it("calls serverConfig as function in generated server config", () => {
    const content = getServerTemplateContent(nuxt, "better-auth-utils/server/auth")

    expect(content).toContain("const resolved = serverConfig()")
  })

  it("imports client config when auth.client.config.ts exists", () => {
    const content = getTemplateContent(nuxt, "better-auth-utils/composables/useAuth.ts")

    expect(content).toContain("import clientConfig")
    expect(content).toContain("defu(clientConfig, {")
  })
})
