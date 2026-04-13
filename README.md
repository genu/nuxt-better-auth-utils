# nuxt-better-auth-utils

Nuxt module for [Better Auth](https://www.better-auth.com/) — full lifecycle integration with auto-wired handler, SSR, session state, and typed server/client APIs.

## Features

- Auto-registered API handler (`/api/auth/**`)
- SSR session pre-fetch — session available on first render
- `useAuth()` composable with reactive `session`, `user`, `loggedIn`, and raw `client` access
- `useServerAuth()` server utility with `requireSession`, `getSession`, and raw `auth` instance
- `auth` route middleware for protecting pages
- `Auth` type export via `#nuxt-better-auth-utils` for typed client plugins
- Session signal listener for cross-tab sync
- Built-in components: `AuthOnly`, `GuestOnly`, `AuthUserButton`, `AuthTeamSwitcher`
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

### Server Config — `server/auth.server.config.ts`

Place this file in the `server/` directory so that server auto-imports (e.g. `useDrizzle()`) are available.

Standard Better Auth options. The module auto-injects `secret`.

```ts
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

### Client Config — `app/auth.client.config.ts`

Place this file in the `app/` directory so that client auto-imports are available.

The client config is deep-merged with the module's defaults (using `defu`), so your options take priority while SSR headers and `baseURL` are filled in automatically.

```ts
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
    redirectTo: '/auth/sign-in', // auth middleware redirect
    handlerRoute: '/api/auth/**', // API handler route
  },
})
```

## Usage

### Client — `useAuth()`

Auto-imported composable with reactive session state and raw client access.

```ts
const { session, user, loggedIn, ready, signOut, fetch, client } = useAuth()

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
// Nullable session (no error thrown)
export default defineEventHandler(async (event) => {
  const { getSession } = useServerAuth()
  const session = await getSession(event) // returns null if unauthenticated
  return { loggedIn: !!session }
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

### Using the `Auth` Type

The module exports the server auth instance type via `#nuxt-better-auth-utils`. This is useful for any client plugin that needs the server type, such as `customSessionClient`:

#### Server — `server/auth.server.config.ts`

```ts
import { customSession } from 'better-auth/plugins'

export default defineAuthConfig({
  database: myAdapter(),
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user,
        session: { ...session, activeOrganization: 'acme' },
      }
    }),
  ],
})
```

#### Client — `app/auth.client.config.ts`

```ts
import { customSessionClient } from 'better-auth/client/plugins'
import type { Auth } from '#nuxt-better-auth-utils'

export default defineAuthClientConfig({
  plugins: [customSessionClient<Auth>()],
})
```

## License

MIT
