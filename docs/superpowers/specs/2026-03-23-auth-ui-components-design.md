# Auth UI Components Design

## Overview

Enhance `nuxt-better-auth-utils` with headless renderless components and composables for common auth UI patterns. Components expose logic and state via slots, leaving all rendering/styling to the consumer.

## Scope

Two new composables and two new renderless components:

- `useAuthOrganization()` composable (new)
- `AuthUserButton` component (new)
- `AuthTeamSwitcher` component (new)
- Extended SSR plugin for org data pre-fetching

Out of scope: `AuthSignIn`, `AuthSignUp` (Better Auth client already provides simple one-liner methods), `AuthSessionList` (deferred).

## Architecture

### Data Flow

1. **SSR plugin** (`auth.server.ts`) — pre-fetches session + org data (when org plugin detected) before middleware runs
2. **Middleware** — accesses both session and org state immediately, no async needed
3. **Composables** (`useAuth()`, `useAuthOrganization()`) — read from hydrated state
4. **Components** — thin slot wrappers over composables

### File Structure

```
src/runtime/
  composables/
    useAuth.ts              (existing, generated)
    useAuthOrganization.ts  (new, generated when org plugin detected)
  components/
    AuthOnly.vue            (existing)
    GuestOnly.vue           (existing)
    AuthUserButton.vue      (new)
    AuthTeamSwitcher.vue    (new)
  plugins/
    auth.server.ts          (extended — also pre-fetches org data)
```

Components are not generated — they are static runtime files. The composables and SSR plugin are generated based on plugin detection.

## Composable API

### `useAuthOrganization()`

Auto-imported when the organization plugin is detected in the client config.

```ts
const {
  organizations,        // Ref<Organization[]> — user's org list
  activeOrganization,   // Ref<Organization | null> — currently active
  switchOrganization,   // (orgId: string) => Promise<void>
  refresh,              // () => Promise<void> — re-fetch org data
  loading,              // Ref<boolean>
  ready,                // Ref<boolean> — initial fetch complete
} = useAuthOrganization()
```

- On server: reads from state populated by SSR plugin
- On client: hydrates from server state, listens for changes
- `switchOrganization()` calls the Better Auth client method and updates local state
- `refresh()` re-fetches from the API (useful after creating/deleting an org)

### `useAuth()` — unchanged

Existing composable. `AuthUserButton` uses this as-is.

### Server-side: `useServerAuth()` extension

When the organization plugin is configured, `useServerAuth()` gains `getActiveOrganization(event)` so server routes and middleware can access org state.

## Component Slot APIs

### `AuthUserButton`

Wraps `useAuth()`. Provides user data and sign-out action via slots.

```vue
<AuthUserButton v-slot="{ user, session, loggedIn, signOut, ready }">
  <!-- consumer renders their own UI -->
</AuthUserButton>
```

Slots:
- `#default` — when authenticated. Props: `user`, `session`, `loggedIn`, `signOut`, `ready`
- `#loading` — while auth state resolves
- `#fallback` — when not authenticated

### `AuthTeamSwitcher`

Wraps `useAuthOrganization()`. Provides org list and switching via slots.

```vue
<AuthTeamSwitcher v-slot="{ organizations, activeOrganization, switchOrganization, refresh, loading, ready }">
  <!-- consumer renders their own dropdown/menu -->
</AuthTeamSwitcher>
```

Slots:
- `#default` — when org data is available. Props: `organizations`, `activeOrganization`, `switchOrganization`, `refresh`, `loading`, `ready`
- `#loading` — while fetching orgs
- `#fallback` — when user has no organizations

### Slot Pattern Consistency

All components follow the `#default` / `#loading` / `#fallback` pattern established by `AuthOnly` and `GuestOnly`.

## Build-time Plugin Detection

### How It Works

The module already reads `auth.client.config.ts` in `generators.ts` to generate typed code. This extends that pattern:

1. At build time, `generators.ts` analyzes the client config to determine which plugins are present
2. When the `organization` plugin is detected:
   - `useAuthOrganization()` composable is generated with full types
   - `AuthTeamSwitcher` component gets proper slot prop types
   - SSR plugin includes org data pre-fetching
3. When the plugin is NOT configured:
   - Composable and component types are generated as stubs producing TypeScript errors
   - Runtime dev warning as safety net

### Type Error (plugin missing)

```ts
// Generated when organization plugin is NOT configured
type UseAuthOrganization = never & {
  error: 'useAuthOrganization requires the organization plugin'
}
```

### Runtime Safety Net

For JavaScript projects or bypassed types, components check at runtime and log a dev warning:

```
[nuxt-better-auth-utils] AuthTeamSwitcher requires the organization plugin to be configured.
```

### SSR Plugin Extension

The generated `auth.server.ts` plugin conditionally fetches org data:

```ts
// Generated when org plugin detected
const session = await getSession(event)
if (session) {
  const orgData = await getActiveOrganization(event)
  // store in useState for hydration
}
```

No runtime cost when the org plugin isn't used — this is all code-generated.

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Component style | Headless/renderless | Matches module philosophy, no styling opinions |
| Auth form components | Excluded | Better Auth client already provides simple methods |
| Plugin detection | Build-time types + runtime warning | Best DX, robust, extends existing pattern |
| SSR data fetching | Extend existing SSR plugin | Data available in middleware, single fetch point |
| Org composable | Fetch on mount + expose refresh | Data ready immediately, re-fetchable when needed |
