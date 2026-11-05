export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const { isAuthenticated, verifySession } = await import('~/src/services/auth')
  const isLogin = to.path === '/login'

  if (!isAuthenticated()) {
    if (!isLogin) return navigateTo('/login')
    return
  }

  const user = await verifySession()
  if (!user) return isLogin ? undefined : navigateTo('/login')
  if (isLogin) return navigateTo('/dashboard')
})
