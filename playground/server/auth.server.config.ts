import { customSession } from "better-auth/plugins";

export default defineAuthConfig({
  database: {
    provider: "sqlite",
    url: ".data/auth.db",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user,
        session: {
          ...session,
          activeOrganization: "sample-org",
        },
      };
    }),
  ],
});
