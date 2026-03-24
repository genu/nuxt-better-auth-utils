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
    :signOut="signOut"
    :ready="ready"
  />
  <slot v-else name="fallback" />
</template>
