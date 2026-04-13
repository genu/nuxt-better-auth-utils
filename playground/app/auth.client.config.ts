import { customSessionClient } from "better-auth/client/plugins";
import type { Auth } from "#nuxt-better-auth-utils";

export default defineAuthClientConfig({
  plugins: [customSessionClient<Auth>()],
});
