import type { BetterAuthOptions } from "better-auth"
import type { BetterAuthClientOptions } from "better-auth/client"

export type AuthServerConfig = Omit<BetterAuthOptions, "secret">
export const defineAuthConfig = (config: AuthServerConfig | (() => AuthServerConfig)) => config
export const defineAuthClientConfig = (config: BetterAuthClientOptions) => config
