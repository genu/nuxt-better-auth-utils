<script setup>
import { ref, onMounted, useAuth } from "#imports";
const { client } = useAuth();
const organizations = ref([]);
const activeOrganization = ref(null);
const loading = ref(true);
const hasOrgPlugin = !!client.organization;
async function fetchOrganizations() {
  if (!hasOrgPlugin) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const orgClient = client.organization;
    const { data: orgList } = await orgClient.listOrganizations();
    organizations.value = orgList || [];
    const { data: activeOrg } = await orgClient.getFullOrganization();
    activeOrganization.value = activeOrg || null;
  } catch (err) {
    if (import.meta.dev) {
      console.error("[nuxt-better-auth-utils] Failed to fetch organizations:", err);
    }
    throw err;
  } finally {
    loading.value = false;
  }
}
async function switchOrganization(orgId) {
  if (!hasOrgPlugin) return;
  const orgClient = client.organization;
  const { error } = await orgClient.setActive({ organizationId: orgId });
  if (error) throw error;
  await fetchOrganizations();
}
async function refresh() {
  await fetchOrganizations();
}
if (!hasOrgPlugin && import.meta.dev) {
  console.warn(
    "[nuxt-better-auth-utils] AuthTeamSwitcher requires the organization plugin to be configured."
  );
}
onMounted(() => {
  fetchOrganizations();
});
</script>

<template>
  <slot v-if="!hasOrgPlugin" name="empty" />
  <slot v-else-if="loading" name="loading" />
  <slot
    v-else-if="organizations.length > 0"
    :organizations="organizations"
    :activeOrganization="activeOrganization"
    :switchOrganization="switchOrganization"
    :refresh="refresh"
    :loading="loading"
  />
  <slot v-else name="empty" />
</template>
