import { describe, it, expect } from "vitest"
import { defineAuthConfig, defineAuthClientConfig } from "../src/types"

describe("defineAuthConfig", () => {
  it("returns a plain config object as-is", () => {
    const config = { database: { provider: "sqlite" as const, url: ":memory:" } }
    const result = defineAuthConfig(config)

    expect(result).toBe(config)
  })

  it("returns a factory function as-is", () => {
    const factory = () => ({ database: { provider: "sqlite" as const, url: ":memory:" } })
    const result = defineAuthConfig(factory)

    expect(result).toBe(factory)
    expect(typeof result).toBe("function")
  })

  it("does not include secret in the config type", () => {
    // This is a compile-time check — at runtime we just verify the helper
    // doesn't modify the config. The Omit<BetterAuthOptions, "secret"> type
    // ensures TypeScript rejects configs with `secret`.
    const config = { database: { provider: "sqlite" as const, url: ":memory:" } }
    expect(defineAuthConfig(config)).toEqual(config)
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
})
