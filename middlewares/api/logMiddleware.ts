export function logMiddleware(res:Request) {
   return {Response: res.method + " " + res.url+"yes working see"}
}