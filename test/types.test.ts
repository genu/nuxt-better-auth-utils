import { describe, it, expect, expectTypeOf } from "vitest"
import { defineAuthConfig, defineAuthClientConfig } from "../src/types"
import { organizationClient, adminClient, customSessionClient } from "better-auth/client/plugins"
import { customSession } from "better-auth/plugins"
import { createAuthClient } from "better-auth/client"

describe("defineAuthConfig", () => {
  it("wraps a plain config object in a function", () => {
    const config = { database: { provider: "sqlite" as const, url: ":memory:" } }
    const result = defineAuthConfig(config)

    expect(typeof result).toBe("function")
    expect(result()).toEqual(config)
  })

  it("returns a factory function as-is", () => {
    const factory = () => ({ database: { provider: "sqlite" as const, url: ":memory:" } })
    const result = defineAuthConfig(factory)

    expect(result).toBe(factory)
    expect(typeof result).toBe("function")
  })

  it("always returns a function regardless of input form", () => {
    const fromObject = defineAuthConfig({ database: { provider: "sqlite" as const, url: ":memory:" } })
    const fromFunction = defineAuthConfig(() => ({ database: { provider: "sqlite" as const, url: ":memory:" } }))

    expect(typeof fromObject).toBe("function")
    expect(typeof fromFunction).toBe("function")
  })

  it("preserves narrow plugin types for custom session inference", () => {
    const serverConfig = defineAuthConfig({
      database: { provider: "sqlite" as const, url: ":memory:" },
      plugins: [
        customSession(async (session) => {
          return {
            ...session,
            customField: "hello" as const,
          }
        }),
      ],
    })

    type ResolvedConfig = ReturnType<typeof serverConfig>
    type AuthInstance = { options: ResolvedConfig & { secret: string } }

    const client = createAuthClient({
      plugins: [customSessionClient<AuthInstance>()],
    })

    type Session = (typeof client.$Infer.Session)["session"]
    type User = (typeof client.$Infer.Session)["user"]

    expectTypeOf<Session>().toHaveProperty("customField")
    expectTypeOf<User>().toHaveProperty("id")
  })

  it("preserves narrow plugin types when config is a factory function", () => {
    const serverConfig = defineAuthConfig(() => ({
      database: { provider: "sqlite" as const, url: ":memory:" },
      plugins: [
        customSession(async (session) => {
          return {
            ...session,
            orgName: "test" as const,
          }
        }),
      ],
    }))

    type ResolvedConfig = ReturnType<typeof serverConfig>
    type AuthInstance = { options: ResolvedConfig & { secret: string } }

    const client = createAuthClient({
      plugins: [customSessionClient<AuthInstance>()],
    })

    type Session = (typeof client.$Infer.Session)["session"]

    expectTypeOf<Session>().toHaveProperty("orgName")
  })
})

describe("defineAuthClientConfig", () => {
  it("returns client config as-is", () => {
    const config = { plugins: [] }
    const result = defineAuthClientConfig(config)

    expect(result).toBe(config)
  })

  it("preserves all config properties", () => {
    const config = {
      baseURL: "http://localhost:3000",
      plugins: [],
    }
    const result = defineAuthClientConfig(config)

    expect(result).toEqual(config)
  })

  it("preserves narrow plugin types from organizationClient", () => {
    const config = defineAuthClientConfig({
      plugins: [organizationClient()],
    })

    const client = createAuthClient(config)
    expectTypeOf(client).toHaveProperty("organization")
  })

  it("preserves narrow plugin types from adminClient", () => {
    const config = defineAuthClientConfig({
      plugins: [adminClient()],
    })

    const client = createAuthClient(config)
    expectTypeOf(client).toHaveProperty("admin")
  })

  it("preserves types from multiple plugins", () => {
    const config = defineAuthClientConfig({
      plugins: [organizationClient(), adminClient()],
    })

    const client = createAuthClient(config)
    expectTypeOf(client).toHaveProperty("organization")
    expectTypeOf(client).toHaveProperty("admin")
  })
})
