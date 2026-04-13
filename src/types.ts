export interface BetterAuthModuleOptions {
  /** Route path for the auth middleware redirect. @default '/auth/sign-in' */
  redirectTo?: string
  /** API handler route. @default '/api/auth/**' */
  handlerRoute?: string
}

export { defineAuthConfig, defineAuthClientConfig } from "./runtime/utils/define-config"
export type { AuthServerConfig } from "./runtime/utils/define-config"
