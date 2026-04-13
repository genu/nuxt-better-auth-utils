export default defineEventHandler(async (event) => {
  const { requireSession } = useServerAuth();

  const { session } = await requireSession(event);

  console.log("Session data:", session.activeOrganization);
  console.log("Hello from the test API route!");
});
