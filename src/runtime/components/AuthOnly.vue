<script setup>
import { useAuth } from "#imports";
const { loggedIn, ready } = useAuth();
</script>

<template>
  <slot v-if="!ready" name="loading" />
  <slot v-else-if="loggedIn" />
  <slot v-else name="fallback" />
</template>
