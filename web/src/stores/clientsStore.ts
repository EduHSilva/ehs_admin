import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createApi } from '../services/http'
import { getToken } from '../services/auth'

type RecordItem = {
  id?: string | number
  name?: string
  companyName?: string
  [key: string]: unknown
}

type ListQuery = {
  page?: number
  size?: number
  q?: string
  status?: string
  role?: string
  sort?: string
  direction?: 'asc' | 'desc'
}

type PageMeta = {
  total: number
  page: number
  size: number
}

type StatsPoint = {
  label: string
  users: number
  companies: number
}

type Stats = {
  totalUsers: number
  totalCompanies: number
  waitingConfirmation: number
  blockedUsers: number
  usersWithoutCompany: number
  series: StatsPoint[]
}

type EmailStats = {
  queue: string
  readyMessages: number
  consumers: number
  sent: number
  errors: number
  lastErrorAt: string | null
  lastErrorTo: string | null
}

function apiErrorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Não foi possível comunicar com a API.'
  )
}

function buildParams(query: ListQuery, defaults: { sort: string }) {
  const params: Record<string, string | number> = {
    page: query.page ?? 0,
    size: query.size ?? 10,
    sort: query.sort || defaults.sort,
    direction: query.direction || 'desc',
  }

  if (query.q?.trim()) params.q = query.q.trim()
  if (query.status) params.status = query.status
  if (query.role) params.role = query.role

  return params
}

export const clientsStore = defineStore('clientsStore', () => {
  const users = ref<RecordItem[]>([])
  const companies = ref<RecordItem[]>([])
  const usersMeta = ref<PageMeta>({ total: 0, page: 0, size: 10 })
  const companiesMeta = ref<PageMeta>({ total: 0, page: 0, size: 10 })
  const stats = ref<Stats | null>(null)
  const emailStats = ref<EmailStats | null>(null)
  const error = ref('')
  const isLoading = ref(false)
  const lastUsersQuery = ref<ListQuery>({})
  const lastCompaniesQuery = ref<ListQuery>({})

  const usersApi = () => {
    const api = createApi(useRuntimeConfig().public.usersApiUrl)
    api.defaults.headers.common.Authorization = `Bearer ${getToken()}`
    return api
  }

  const notificationsApi = () => {
    const api = createApi(useRuntimeConfig().public.notificationsApiUrl)
    api.defaults.headers.common.Authorization = `Bearer ${getToken()}`
    return api
  }

  async function fetchUsers(query: ListQuery = {}) {
    error.value = ''
    isLoading.value = true
    lastUsersQuery.value = { ...query }

    try {
      const result = await usersApi().get('/', {
        params: buildParams(query, { sort: 'createdDate' }),
      })
      const data = result?.data?.data

      users.value = (data?.items ?? []) as RecordItem[]
      usersMeta.value = {
        total: data?.total ?? 0,
        page: data?.page ?? 0,
        size: data?.size ?? query.size ?? 10,
      }
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCompanies(query: ListQuery = {}) {
    error.value = ''
    isLoading.value = true
    lastCompaniesQuery.value = { ...query }

    try {
      const result = await usersApi().get('/companies', {
        params: buildParams(query, { sort: 'createdDate' }),
      })
      const data = result?.data?.data

      companies.value = (data?.items ?? []) as RecordItem[]
      companiesMeta.value = {
        total: data?.total ?? 0,
        page: data?.page ?? 0,
        size: data?.size ?? query.size ?? 10,
      }
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStats(query: { from?: string; to?: string; interval?: string } = {}) {
    error.value = ''

    try {
      const params: Record<string, string> = {}

      if (query.from) params.from = query.from
      if (query.to) params.to = query.to
      if (query.interval) params.interval = query.interval

      const result = await usersApi().get('/stats', { params })
      stats.value = (result?.data?.data ?? null) as Stats | null
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    }
  }

  async function fetchEmailStats() {
    error.value = ''

    try {
      const result = await notificationsApi().get('/admin/queue-stats')
      emailStats.value = (result?.data?.data ?? null) as EmailStats | null
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    }
  }

  async function deleteCompany(id: string | number) {
    error.value = ''
    isLoading.value = true

    try {
      await usersApi().delete(`/companies/${id}`)

      const removed = companies.value.find((item) => String(item.id) === String(id))
      companies.value = companies.value.filter((item) => String(item.id) !== String(id))
      companiesMeta.value = {
        ...companiesMeta.value,
        total: Math.max(0, companiesMeta.value.total - 1),
      }

      if (removed?.name) {
        users.value = users.value.filter((user) => user.companyName !== removed.name)
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id: string | number) {
    error.value = ''
    isLoading.value = true

    try {
      const result = await usersApi().get(`/${id}`)
      const item = result?.data?.data as RecordItem | undefined

      if (item) {
        const index = users.value.findIndex((entry) => String(entry.id) === String(id))

        if (index >= 0) {
          users.value[index] = { ...users.value[index], ...item }
        } else {
          users.value.push(item)
        }
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCompany(id: string | number) {
    error.value = ''
    isLoading.value = true

    try {
      const result = await usersApi().get(`/companies/${id}`)
      const item = result?.data?.data as RecordItem | undefined

      if (item) {
        const index = companies.value.findIndex((entry) => String(entry.id) === String(id))

        if (index >= 0) {
          companies.value[index] = { ...companies.value[index], ...item }
        } else {
          companies.value.push(item)
        }
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function saveUser(
    id: string | number,
    payload: {
      username: string
      email?: string | null
      roles?: string[] | null
    },
  ) {
    error.value = ''
    isLoading.value = true

    try {
      const result = await usersApi().put(`/${id}`, payload)
      const updated = result?.data?.data as RecordItem | undefined
      const index = users.value.findIndex((item) => String(item.id) === String(id))

      if (index >= 0) {
        users.value[index] = { ...users.value[index], ...(updated ?? payload) }
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserStatus(id: string | number, status: 'OK' | 'BLOCKED') {
    error.value = ''
    isLoading.value = true

    try {
      const result = await usersApi().patch(`/${id}/status`, { status })
      const updated = result?.data?.data as RecordItem | undefined
      const index = users.value.findIndex((item) => String(item.id) === String(id))

      if (index >= 0 && updated) {
        users.value[index] = { ...users.value[index], ...updated }
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function resendConfirmation(id: string | number) {
    error.value = ''
    isLoading.value = true

    try {
      await usersApi().post(`/${id}/resend-confirmation`)
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function saveCompany(id: string | number, payload: { name: string }) {
    error.value = ''
    isLoading.value = true

    try {
      const result = await usersApi().put(`/companies/${id}`, payload)
      const updated = result?.data?.data as RecordItem | undefined
      const index = companies.value.findIndex((item) => String(item.id) === String(id))

      if (index >= 0) {
        companies.value[index] = { ...companies.value[index], ...(updated ?? payload) }
      }

      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function downloadCsv(path: string, filename: string, params: Record<string, string>) {
    error.value = ''

    try {
      const response = await usersApi().get(path, { params, responseType: 'blob' })
      const url = URL.createObjectURL(response.data as Blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
      return true
    } catch (requestError) {
      error.value = apiErrorMessage(requestError)
      return false
    }
  }

  function filterParams(query: ListQuery) {
    const params: Record<string, string> = {}

    if (query.q?.trim()) params.q = query.q.trim()
    if (query.status) params.status = query.status
    if (query.role) params.role = query.role

    return params
  }

  async function exportUsersCsv(query: ListQuery = lastUsersQuery.value) {
    return downloadCsv('/export', 'usuarios.csv', filterParams(query))
  }

  async function exportCompaniesCsv(query: ListQuery = lastCompaniesQuery.value) {
    return downloadCsv('/companies/export', 'empresas.csv', filterParams(query))
  }

  return {
    users,
    usersMeta,
    fetchUsers,
    fetchUser,
    updateUserStatus,
    resendConfirmation,
    exportUsersCsv,
    stats,
    fetchStats,
    emailStats,
    fetchEmailStats,
    companies,
    companiesMeta,
    fetchCompanies,
    fetchCompany,
    deleteCompany,
    exportCompaniesCsv,
    saveUser,
    saveCompany,
    error,
    isLoading,
  }
})
