# Auth UI Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `AuthUserButton` and `AuthTeamSwitcher` headless renderless components to `nuxt-better-auth-utils`.

**Architecture:** Static Vue components registered via `addComponent()`. `AuthUserButton` wraps `useAuth()`. `AuthTeamSwitcher` uses `useAuth().client.organization` with a runtime guard. No new composables, no SSR plugin changes, no build-time detection.

**Tech Stack:** Nuxt 4, Vue 3, Better Auth, Vitest

**Spec:** `docs/superpowers/specs/2026-03-23-auth-ui-components-design.md`

---

### Task 1: AuthUserButton component

**Files:**
- Create: `src/runtime/components/AuthUserButton.vue`
- Modify: `src/module.ts:88-97` (add component registration)

- [ ] **Step 1: Write the failing test for AuthUserButton registration**

Add a test to `test/module.test.ts` in the "module setup with defaults" describe block:

```ts
it("registers AuthUserButton component", () => {
  const component = nuxt.options.components.find(
    (c: { pascalName?: string }) => c.pascalName === "AuthUserButton",
  )
  expect(component).toBeDefined()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm test -- --reporter=verbose test/module.test.ts`
Expected: FAIL — "AuthUserButton" component not found

- [ ] **Step 3: Create AuthUserButton.vue**

Create `src/runtime/components/AuthUserButton.vue`:

```vue
<script setup lang="ts">
import { useAuth } from "#imports"

const { user, session, signOut, ready, loggedIn } = useAuth()
</script>

<template>
  <slot v-if="!ready" name="loading" />
  <slot
    v-else-if="loggedIn"
    :user="user"
    :session="session"
    :sign-out="signOut"
    :ready="ready"
  />
  <slot v-else name="fallback" />
</template>
```

- [ ] **Step 4: Register the component in module.ts**

Add after the `GuestOnly` component registration (after line 97 in `src/module.ts`):

```ts
addComponent({
  name: "AuthUserButton",
  filePath: resolve("./runtime/components/AuthUserButton.vue"),
})
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm test -- --reporter=verbose test/module.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/runtime/components/AuthUserButton.vue src/module.ts test/module.test.ts
git commit -m "feat: add AuthUserButton renderless component"
```

---

### Task 2: AuthTeamSwitcher component

**Files:**
- Create: `src/runtime/components/AuthTeamSwitcher.vue`
- Modify: `src/module.ts` (add component registration)

- [ ] **Step 1: Write the failing test for AuthTeamSwitcher registration**

Add a test to `test/module.test.ts` in the "module setup with defaults" describe block:

```ts
it("registers AuthTeamSwitcher component", () => {
  const component = nuxt.options.components.find(
    (c: { pascalName?: string }) => c.pascalName === "AuthTeamSwitcher",
  )
  expect(component).toBeDefined()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm test -- --reporter=verbose test/module.test.ts`
Expected: FAIL — "AuthTeamSwitcher" component not found

- [ ] **Step 3: Create AuthTeamSwitcher.vue**

Create `src/runtime/components/AuthTeamSwitcher.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAuth } from "#imports"

const { client } = useAuth()

const organizations = ref<unknown[]>([])
const activeOrganization = ref<unknown | null>(null)
const loading = ref(true)
const ready = ref(false)

const hasOrgPlugin = !!(client as Record<string, unknown>).organization

async function fetchOrganizations() {
  if (!hasOrgPlugin) return

  loading.value = true
  try {
    const orgClient = (client as Record<string, any>).organization
    const { data: orgList } = await orgClient.listOrganizations()
    organizations.value = orgList || []

    const { data: activeOrg } = await orgClient.getFullOrganization()
    activeOrganization.value = activeOrg || null
  } catch (err) {
    if (import.meta.dev) {
      console.error("[nuxt-better-auth-utils] Failed to fetch organizations:", err)
    }
    throw err
  } finally {
    loading.value = false
    ready.value = true
  }
}

async function switchOrganization(orgId: string) {
  if (!hasOrgPlugin) return

  const orgClient = (client as Record<string, any>).organization
  const { error } = await orgClient.setActive({ organizationId: orgId })
  if (error) throw error
  await fetchOrganizations()
}

async function refresh() {
  await fetchOrganizations()
}

if (!hasOrgPlugin && import.meta.dev) {
  console.warn(
    "[nuxt-better-auth-utils] AuthTeamSwitcher requires the organization plugin to be configured.",
  )
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<template>
  <slot v-if="!hasOrgPlugin" name="empty" />
  <slot v-else-if="loading && !ready" name="loading" />
  <slot
    v-else-if="organizations.length > 0"
    :organizations="organizations"
    :active-organization="activeOrganization"
    :switch-organization="switchOrganization"
    :refresh="refresh"
    :loading="loading"
  />
  <slot v-else name="empty" />
</template>
```

- [ ] **Step 4: Register the component in module.ts**

Add after the `AuthUserButton` component registration in `src/module.ts`:

```ts
addComponent({
  name: "AuthTeamSwitcher",
  filePath: resolve("./runtime/components/AuthTeamSwitcher.vue"),
})
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm test -- --reporter=verbose test/module.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/runtime/components/AuthTeamSwitcher.vue src/module.ts test/module.test.ts
git commit -m "feat: add AuthTeamSwitcher renderless component"
```

---

### Task 3: Verify all tests pass

- [ ] **Step 1: Run full test suite**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm test -- --reporter=verbose`
Expected: All tests PASS

- [ ] **Step 2: Run type check**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Verify build**

Run: `cd /Users/AV6AB7Z/conductor/workspaces/nuxt-better-auth/sofia && pnpm prepack`
Expected: Build succeeds, dist/ contains the new components
