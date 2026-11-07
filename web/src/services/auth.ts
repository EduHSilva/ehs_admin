import axios from 'axios'

const TOKEN_STORAGE_KEY = 'ehs-admin-token'
const USER_STORAGE_KEY = 'ehs-admin-user'

type AuthUser = {
  token?: string
  id?: string | number
  username?: string
  [key: string]: unknown
}

type SignInPayload = {
  email: string
  password: string
}

function authApi() {
  return axios.create({
    baseURL: useRuntimeConfig().public.usersApiUrl,
  })
}

export function getToken() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getUser() {
  if (typeof localStorage === 'undefined') return null
  const user = localStorage.getItem(USER_STORAGE_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user) as AuthUser
  } catch {
    signOut()
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

function saveSession(user: AuthUser) {
  if (!user?.token) {
    throw new Error('A resposta de autenticacao nao retornou um token.')
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, user.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...user, token: undefined }))
}

export async function signIn({ email, password }: SignInPayload) {
  try {
    const response = await authApi().post('/auth/login', { email, password })
    const user = response.data?.data as AuthUser

    saveSession(user)
    return user
  } catch (error) {
    signOut()
    throw error
  }
}

export function updateStoredUser(partial: AuthUser) {
  const current = getUser()

  if (!current) {
    return
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...current, ...partial, token: undefined }))
}

export async function logoutAllSessions() {
  const token = getToken()

  if (!token) {
    throw new Error('Sessão inválida.')
  }

  await authApi().post('/auth/logout-all', null, {
    headers: { Authorization: `Bearer ${token}` },
  })

  signOut()
}

export async function verifySession() {
  const token = getToken()

  if (!token) {
    return null
  }

  try {
    const response = await authApi().get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = response.data?.data as AuthUser

    if (!user?.id) {
      throw new Error('A sessao retornou dados de usuario invalidos.')
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  } catch {
    signOut()
    return null
  }
}

export function signOut() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}
