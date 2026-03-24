import { defineAuthConfig } from "../../../../src/types"

export default defineAuthConfig({
  database: {
    provider: "sqlite",
    url: ":memory:",
  },
})
