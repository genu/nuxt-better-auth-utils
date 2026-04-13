<script lang="ts">
export default defineComponent({
  name: "SpaPage",
})
</script>

<script setup lang="ts">
const { loggedIn, session } = useAuth()
</script>

<template>
  <div style="padding: 1rem">
    <h1>SPA Page (ssr: false)</h1>
    <p>This page uses <code>ssr: false</code> route rule.</p>
    <p>loggedIn: <strong>{{ loggedIn }}</strong></p>
    <p>session: <pre>{{ session ?? 'null (but fetch() was attempted by client plugin)' }}</pre></p>
    <p style="color: green" v-if="loggedIn">Session was fetched successfully on the client!</p>
    <p style="color: orange" v-else>No session — but the client plugin DID attempt to fetch it (check Network tab for <code>/api/auth/get-session</code> request).</p>
  </div>
</template>
