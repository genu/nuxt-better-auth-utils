import type { BetterAuthOptions } from "better-auth"
import type { BetterAuthClientOptions } from "better-auth/client"

export type AuthServerConfig = Omit<BetterAuthOptions, "secret">
export const defineAuthConfig = <T extends AuthServerConfig>(config: T | (() => T)) => config
export const defineAuthClientConfig = <T extends BetterAuthClientOptions>(config: T) => config
