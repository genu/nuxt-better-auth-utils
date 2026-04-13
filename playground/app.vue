<script setup lang="ts">
const { loggedIn, user, signOut } = useAuth()
</script>

<template>
  <div>
    <nav style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #ccc">
      <NuxtLink to="/">Home (SSR)</NuxtLink>
      <NuxtLink to="/spa">SPA Page (ssr: false)</NuxtLink>
      <NuxtLink to="/protected">Protected</NuxtLink>

      <div style="margin-left: auto; display: flex; align-items: center; gap: 0.5rem">
        <template v-if="loggedIn">
          <span>{{ user?.email }}</span>
          <button @click="signOut({ redirectTo: '/login' })">Sign Out</button>
        </template>
        <NuxtLink v-else to="/login">Sign In</NuxtLink>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>
