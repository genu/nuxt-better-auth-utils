import type { BetterAuthOptions } from "better-auth"
import type { BetterAuthClientOptions } from "better-auth/client"

export type AuthServerConfig = Omit<BetterAuthOptions, "secret">

export function defineAuthConfig<T extends AuthServerConfig>(config: () => T): () => T
export function defineAuthConfig<T extends AuthServerConfig>(config: T): () => T
export function defineAuthConfig<T extends AuthServerConfig>(config: T | (() => T)) {
  return typeof config === "function" ? config : () => config
}

export const defineAuthClientConfig = <T extends BetterAuthClientOptions>(config: T) => config
