<script setup lang="ts">
const { loggedIn, session, user } = useAuth()
</script>

<template>
  <div style="padding: 1rem">
    <h1>Home (SSR)</h1>

    <AuthOnly>
      <h3>Welcome, {{ user?.name }}!</h3>
      <p>loggedIn: <strong>{{ loggedIn }}</strong></p>
      <details>
        <summary>Session data</summary>
        <pre>{{ session }}</pre>
      </details>
      <details>
        <summary>User data</summary>
        <pre>{{ user }}</pre>
      </details>
    </AuthOnly>

    <GuestOnly>
      <p>You are not signed in. <NuxtLink to="/login">Sign in</NuxtLink> to see your session data.</p>
    </GuestOnly>
  </div>
</template>
