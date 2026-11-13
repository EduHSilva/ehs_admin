export const TOKEN_STORAGE_KEY = 'ehs-admin-token'
export const USER_STORAGE_KEY = 'ehs-admin-user'

export function clearSession() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}
