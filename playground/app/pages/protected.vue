<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div style="padding: 1rem">
    <h1>Protected Page</h1>
    <p>This page uses the <code>auth</code> middleware. You will be redirected to <code>/login</code> if not authenticated.</p>
    <p>If you can see this, you are authenticated.</p>
  </div>
</template>
