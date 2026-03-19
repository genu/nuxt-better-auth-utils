export default defineEventHandler((event) => useServerAuth().auth.handler(toWebRequest(event)))
