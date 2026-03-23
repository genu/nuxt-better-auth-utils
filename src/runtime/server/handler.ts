import { defineEventHandler, toWebRequest } from "h3"

export default defineEventHandler((event) => useServerAuth().auth.handler(toWebRequest(event)))
