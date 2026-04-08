import type { BetterAuthOptions } from "better-auth"
import type { BetterAuthClientOptions } from "better-auth/client"

export interface BetterAuthModuleOptions {
  /** Route path for the auth middleware redirect. @default '/auth/sign-in' */
  redirectTo?: string
  /** API handler route. @default '/api/auth/**' */
  handlerRoute?: string
}

export type AuthServerConfig = Omit<BetterAuthOptions, "secret">

export const defineAuthConfig = <T extends AuthServerConfig>(config: T | (() => T)) => config

export const defineAuthClientConfig = <T extends BetterAuthClientOptions>(config: T) => config
