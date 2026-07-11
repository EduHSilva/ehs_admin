import axios from 'axios'

const TOKEN_STORAGE_KEY = 'ehs-admin-token'
const USER_STORAGE_KEY = 'ehs-admin-user'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL || 'http://localhost/users',
})

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getUser() {
  const user = localStorage.getItem(USER_STORAGE_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    signOut()
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

function saveSession(user) {
  if (!user?.token) {
    throw new Error('A resposta de autenticação não retornou um token.')
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, user.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...user, token: undefined }))
}

export async function signIn({ email, password }) {
  try {
    const response = await authApi.post('/auth/login', { email, password })
    const user = response.data?.data

    saveSession(user)
    return user
  } catch (error) {
    signOut()
    throw error
  }
}

export async function verifySession() {
  const token = getToken()

  if (!token) {
    return null
  }

  try {
    const response = await authApi.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = response.data?.data

    if (!user?.id) {
      throw new Error('A sessão retornou dados de usuário inválidos.')
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  } catch {
    signOut()
    return null
  }
}

export function signOut() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}
