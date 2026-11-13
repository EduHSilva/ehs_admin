import axios, { type AxiosInstance } from 'axios'
import { navigateTo } from '#imports'
import { clearSession } from './session'

/**
 * Cliente axios do painel: 401 encerra a sessão e volta para o login.
 * 403 é permissão negada (role/ação) e não deve derrubar a sessão.
 */
export function createApi(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        clearSession()
        await navigateTo('/login')
      }

      return Promise.reject(error)
    },
  )

  return instance
}
