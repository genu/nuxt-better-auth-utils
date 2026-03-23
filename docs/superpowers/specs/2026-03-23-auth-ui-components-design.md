# Auth UI Components Design

## Overview

Enhance `nuxt-better-auth-utils` with headless renderless components for common auth UI patterns. Components expose logic and state via slots, leaving all rendering/styling to the consumer.

## Scope

Two new renderless components:

- `AuthUserButton` component (new)
- `AuthTeamSwitcher` component (new)

No new composables — components use `useAuth()` and `useAuth().client.organization` directly.

No SSR plugin changes — org data is fetched client-side on mount. Session pre-fetching remains as-is.

Out of scope: `AuthSignIn`, `AuthSignUp` (Better Auth client already provides simple one-liner methods), `AuthSessionList` (deferred), per-plugin composables (users access `useAuth().client.<plugin>` directly).

## Architecture

### Data Flow

1. **SSR plugin** (`auth.server.ts`) — pre-fetches session (existing, unchanged)
2. **`AuthUserButton`** — wraps `useAuth()`, exposes user/session/signOut via slots
3. **`AuthTeamSwitcher`** — uses `useAuth().client.organization` to fetch and manage org data client-side, exposes via slots

### File Structure

```
src/runtime/
  components/
    AuthOnly.vue            (existing)
    GuestOnly.vue           (existing)
    AuthUserButton.vue      (new)
    AuthTeamSwitcher.vue    (new)
```

Both components are static runtime files registered via `addComponent()`.

### Plugin Detection

No build-time plugin detection. Type safety comes from Better Auth's own type inference:

- If the user configured `organizationClient()` in their auth client config, `useAuth().client.organization` is fully typed
- If not, accessing `client.organization` produces a TypeScript error automatically
- `AuthTeamSwitcher` checks at runtime if `client.organization` exists — if not, logs a dev warning and renders `#fallback`

This avoids fragile AST parsing, duplicate config, or module option flags. The user configures Better Auth once, and types flow naturally.

## Component Slot APIs

### `AuthUserButton`

Wraps `useAuth()`. Provides user data and sign-out action via slots.

```vue
<AuthUserButton v-slot="{ user, session, signOut, ready }">
  <!-- consumer renders their own UI -->
</AuthUserButton>
```

Slots:
- `#default` — when authenticated. Props: `user`, `session`, `signOut`, `ready`
- `#loading` — while auth state resolves
- `#fallback` — when not authenticated

### `AuthTeamSwitcher`

Uses `useAuth().client.organization` to manage org state. Fetches org list on mount, exposes `refresh()` for re-fetching.

```vue
<AuthTeamSwitcher v-slot="{ organizations, activeOrganization, switchOrganization, refresh, loading }">
  <!-- consumer renders their own dropdown/menu -->
</AuthTeamSwitcher>
```

Slots:
- `#default` — when org data is loaded and user has organizations. Props: `organizations`, `activeOrganization`, `switchOrganization`, `refresh`, `loading`
- `#loading` — while fetching orgs on initial load
- `#empty` — when user has no organizations (distinct from `#fallback` in `AuthOnly`)

`switchOrganization(orgId)` throws on error, consistent with `useAuth().signOut()`.

### Slot Pattern

- `AuthUserButton` follows `#default` / `#loading` / `#fallback` consistent with `AuthOnly`/`GuestOnly`
- `AuthTeamSwitcher` uses `#default` / `#loading` / `#empty` — different from `#fallback` because "no orgs" is semantically different from "wrong auth state". `AuthTeamSwitcher` should be used inside an authenticated context (e.g., nested in `AuthOnly` or on a protected page).

### Runtime Guard

`AuthTeamSwitcher` checks for the organization plugin at runtime:

```ts
const { client } = useAuth()
if (!client.organization) {
  if (import.meta.dev) {
    console.warn('[nuxt-better-auth-utils] AuthTeamSwitcher requires the organization plugin to be configured.')
  }
  // render #empty slot
}
```

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Component style | Headless/renderless | Matches module philosophy, no styling opinions |
| Auth form components | Excluded | Better Auth client already provides simple methods |
| Plugin detection | Runtime check + Better Auth's own types | No config duplication, no fragile AST parsing |
| SSR pre-fetching for orgs | Not included | Keep simple for v1, can add later if needed |
| Per-plugin composables | Not included | `useAuth().client.<plugin>` is already a one-liner |
| `AuthTeamSwitcher` empty slot | `#empty` instead of `#fallback` | Different semantics from auth state fallback |
| `loggedIn` in `AuthUserButton` default slot | Excluded | Always true when default slot renders |
| Error handling | Throw on error | Consistent with existing `signOut()` behavior |
