<script setup lang="ts">
const { client, session, user } = useAuth();

const mode = ref<"signin" | "signup">("signin");
const email = ref("");
const password = ref("");
const name = ref("");
const error = ref("");
const loading = ref(false);

console.log("Current session:", session.value?.activeOrganization);
async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    if (mode.value === "signup") {
      const { error: signUpError } = await client.signUp.email({
        email: email.value,
        password: password.value,
        name: name.value,
      });
      if (signUpError) {
        error.value = signUpError.message ?? "Sign up failed";
        return;
      }
    } else {
      const { error: signInError } = await client.signIn.email({
        email: email.value,
        password: password.value,
      });
      if (signInError) {
        error.value = signInError.message ?? "Sign in failed";
        return;
      }
    }

    await navigateTo("/");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="padding: 2rem; max-width: 400px; margin: 0 auto">
    <h1>{{ mode === "signin" ? "Sign In" : "Sign Up" }}</h1>

    <form
      style="display: flex; flex-direction: column; gap: 0.75rem"
      @submit.prevent="handleSubmit"
    >
      <input
        v-if="mode === 'signup'"
        v-model="name"
        type="text"
        placeholder="Name"
        required
        style="padding: 0.5rem"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        style="padding: 0.5rem"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="8"
        style="padding: 0.5rem"
      />

      <button type="submit" :disabled="loading" style="padding: 0.5rem">
        {{ loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up" }}
      </button>

      <p v-if="error" style="color: red">{{ error }}</p>
    </form>

    <p style="margin-top: 1rem; text-align: center">
      <template v-if="mode === 'signin'">
        Don't have an account?
        <a href="#" @click.prevent="mode = 'signup'">Sign up</a>
      </template>
      <template v-else>
        Already have an account?
        <a href="#" @click.prevent="mode = 'signin'">Sign in</a>
      </template>
    </p>
  </div>
</template>
