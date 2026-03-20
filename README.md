# nuxt-better-auth-utils

Nuxt module for [Better Auth](https://www.better-auth.com/) — full lifecycle integration with auto-wired handler, SSR, session state, and typed server/client APIs.

## Features

- Auto-registered API handler (`/api/auth/**`)
- SSR session pre-fetch — session available on first render
- `useAuth()` composable with reactive `session`, `user`, `loggedIn`, and raw `client` access
- `useServerAuth()` server utility with `requireSession`, `getSession`, and raw `auth` instance
- `auth` route middleware for protecting pages
- `customSessionClient<AuthInstance>()` auto-injected for full session type inference
- Session signal listener for cross-tab sync
- Zero opinions on database adapter, plugins, or auth strategy

## Setup

```bash
npx nuxi module add nuxt-better-auth-utils
```

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-better-auth-utils'],
})
```

Set `BETTER_AUTH_SECRET` in your `.env` (or `NUXT_SECRET`).

## Configuration

### Server Config — `auth.server.config.ts`

Standard Better Auth options. The module auto-injects `secret`.

```ts
import { defineAuthConfig } from '#better-auth-utils'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'

export default defineAuthConfig({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  plugins: [organization()],
})
```

Supports factory functions for deferred access to runtime utilities:

```ts
export default defineAuthConfig(() => {
  const db = useDrizzle()
  return {
    database: drizzleAdapter(db, { provider: 'pg' }),
  }
})
```

### Client Config — `auth.client.config.ts`

```ts
import { defineAuthClientConfig } from '#better-auth-utils'
import { organizationClient } from 'better-auth/client/plugins'

export default defineAuthClientConfig({
  plugins: [organizationClient()],
})
```

Both files are optional. If absent, the module uses bare defaults.

### Module Options

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  betterAuthUtils: {
    configPath: '~~/',           // where to find config files
    redirectTo: '/auth/sign-in', // auth middleware redirect
    handlerRoute: '/api/auth/**', // API handler route
  },
})
```

## Usage

### Client — `useAuth()`

Auto-imported composable with reactive session state and raw client access.

```ts
const { session, user, loggedIn, signOut, fetch, client } = useAuth()

// Use the raw Better Auth client for any operation
await client.signIn.email({ email, password })
await client.signUp.email({ email, password, name })
await client.organization.create({ name: 'Acme' })

// Convenience helpers
await signOut({ redirectTo: '/login' })
await fetch() // refresh session
```

### Server — `useServerAuth()`

Auto-imported in server routes.

```ts
// server/api/me.ts
export default defineEventHandler(async (event) => {
  const { requireSession } = useServerAuth()
  const session = await requireSession(event) // throws 401 if unauthenticated
  return session.user
})
```

```ts
// Advanced: use raw Better Auth instance
export default defineEventHandler(async (event) => {
  const { auth } = useServerAuth()
  const users = await auth.api.listUsers()
})
```

### Protecting Pages

```ts
definePageMeta({
  middleware: 'auth',
})
```

### Custom Session

Use Better Auth's `customSession` plugin with the `satisfies` pattern for full type inference:

```ts
import { defineAuthConfig } from '#better-auth-utils'
import type { BetterAuthOptions } from 'better-auth'
import { customSession, organization } from 'better-auth/plugins'

export default defineAuthConfig(() => {
  const baseOptions = {
    database: myAdapter(),
    plugins: [organization()],
  } satisfies BetterAuthOptions

  return {
    ...baseOptions,
    plugins: [
      ...baseOptions.plugins,
      customSession(async ({ user, session }) => {
        // session.activeOrganizationId is typed correctly
        return { user, session: { ...session, extra: 'data' } }
      }, baseOptions),
    ],
  }
})
```

The module auto-injects `customSessionClient<AuthInstance>()` on the client, so `useAuth().session` is fully typed with your custom session fields.

## License

MIT
