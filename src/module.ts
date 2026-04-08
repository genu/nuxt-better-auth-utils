import {
  defineNuxtModule,
  addServerHandler,
  addServerTemplate,
  addTemplate,
  addImports,
  addServerImports,
  addPlugin,
  addRouteMiddleware,
  addComponent,
  addTypeTemplate,
  createResolver,
} from "@nuxt/kit"
import { existsSync } from "node:fs"
import { join } from "node:path"
import type { BetterAuthModuleOptions } from "./types"
import { generateServerAuth, generateServerAuthTypes, generateUseAuth, generateAuthMiddleware } from "./generators"

export default defineNuxtModule<BetterAuthModuleOptions>({
  meta: {
    name: "better-auth-utils",
    configKey: "betterAuthUtils",
  },
  defaults: {
    redirectTo: "/auth/sign-in",
    handlerRoute: "/api/auth/**",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const serverConfigAlias = "~~/server/auth.server.config"
    const clientConfigAlias = "~~/app/auth.client.config"

    // Resolve actual file paths to check existence
    const resolveAlias = (alias: string) => alias.replace("~~/", `${nuxt.options.rootDir}/`) + ".ts"
    const hasServerConfig = existsSync(resolveAlias(serverConfigAlias))
    const hasClientConfig = existsSync(resolveAlias(clientConfigAlias))

    // Build dir paths for generated files
    const buildDir = nuxt.options.buildDir

    // --- Server: catch-all API handler ---
    addServerHandler({
      route: options.handlerRoute!,
      handler: resolve("./runtime/server/handler"),
    })

    // --- Server: useServerAuth() utility (plain JS for Nitro/Rollup) ---
    const serverAuthVirtualId = "#better-auth-utils/server/auth"

    addServerTemplate({
      filename: serverAuthVirtualId,
      getContents: () => generateServerAuth(serverConfigAlias, hasServerConfig),
    })

    addTypeTemplate(
      {
        filename: "better-auth-utils/server/auth.d.ts",
        getContents: () => generateServerAuthTypes(),
      },
      { nitro: true },
    )

    addServerImports([
      { name: "useServerAuth", from: serverAuthVirtualId },
      { name: "AuthInstance", type: true, from: serverAuthVirtualId },
    ])

    // --- Client: useAuth() composable ---
    addTemplate({
      filename: "better-auth-utils/composables/useAuth.ts",
      write: true,
      getContents: () => generateUseAuth(clientConfigAlias, hasClientConfig, serverConfigAlias, hasServerConfig),
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

    // --- Components: AuthOnly, GuestOnly ---
    addComponent({
      name: "AuthOnly",
      filePath: resolve("./runtime/components/AuthOnly.vue"),
    })

    addComponent({
      name: "GuestOnly",
      filePath: resolve("./runtime/components/GuestOnly.vue"),
    })

    addComponent({
      name: "AuthUserButton",
      filePath: resolve("./runtime/components/AuthUserButton.vue"),
    })

    addComponent({
      name: "AuthTeamSwitcher",
      filePath: resolve("./runtime/components/AuthTeamSwitcher.vue"),
    })

    // --- Alias for user config imports ---
    nuxt.options.alias["#better-auth-utils"] = resolve("./runtime/types")
  },
})
