import {
  defineNuxtModule,
  addServerHandler,
  addTemplate,
  addImports,
  addServerImports,
  addPlugin,
  addRouteMiddleware,
  createResolver,
} from "@nuxt/kit"
import { existsSync } from "node:fs"
import { join } from "node:path"
import type { BetterAuthModuleOptions } from "./types"
import { generateServerAuth, generateUseAuth, generateAuthMiddleware } from "./generators"

export default defineNuxtModule<BetterAuthModuleOptions>({
  meta: {
    name: "better-auth-utils",
    configKey: "betterAuthUtils",
  },
  defaults: {
    configPath: "~~/",
    redirectTo: "/auth/sign-in",
    handlerRoute: "/api/auth/**",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const configDir = options.configPath!
    const serverConfigAlias = `${configDir}auth.server.config`
    const clientConfigAlias = `${configDir}auth.client.config`

    // Resolve actual file paths to check existence
    const resolveAlias = (alias: string) => alias.replace("~~/", `${nuxt.options.rootDir}/`) + ".ts"
    const hasServerConfig = existsSync(resolveAlias(serverConfigAlias))
    const hasClientConfig = existsSync(resolveAlias(clientConfigAlias))

    // Build dir paths for generated files
    const buildDir = nuxt.options.buildDir
    const serverAuthPath = join(buildDir, "better-auth-utils/server/utils/auth")

    // --- Server: catch-all API handler ---
    addServerHandler({
      route: options.handlerRoute!,
      handler: resolve("./runtime/server/handler"),
    })

    // --- Server: useServerAuth() utility ---
    addTemplate({
      filename: "better-auth-utils/server/utils/auth.ts",
      write: true,
      getContents: () => generateServerAuth(serverConfigAlias, hasServerConfig),
    })

    addServerImports([
      { name: "useServerAuth", from: serverAuthPath },
      { name: "AuthInstance", type: true, from: serverAuthPath },
    ])

    // --- Client: useAuth() composable ---
    addTemplate({
      filename: "better-auth-utils/composables/useAuth.ts",
      write: true,
      getContents: () => generateUseAuth(clientConfigAlias, hasClientConfig),
    })

    addImports([{ name: "useAuth", from: join(buildDir, "better-auth-utils/composables/useAuth") }])

    // --- SSR Plugin ---
    addPlugin({
      src: resolve("./runtime/plugins/auth.server"),
      mode: "server",
    })

    // --- Route Middleware ---
    addTemplate({
      filename: "better-auth-utils/middleware/auth.ts",
      write: true,
      getContents: () => generateAuthMiddleware(options.redirectTo!),
    })

    addRouteMiddleware({
      name: "auth",
      path: join(buildDir, "better-auth-utils/middleware/auth"),
    })

    // --- Alias for user config imports ---
    nuxt.options.alias["#better-auth-utils"] = resolve("./types")
  },
})

