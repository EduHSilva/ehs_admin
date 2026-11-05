import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getToken } from '../services/auth'

type RecordItem = {
  id?: string | number
  [key: string]: unknown
}

export const clientsStore = defineStore('clientsStore', () => {
  const users = ref<RecordItem[]>([])
  const companies = ref<RecordItem[]>([])

  const usersApi = () =>
    axios.create({
      baseURL: useRuntimeConfig().public.usersApiUrl,
      headers: { Authorization: `Bearer ${getToken()}` },
    })

  async function fetchUsers() {
    try {
      const result = await usersApi().get('/')
      users.value = (result?.data?.data?.items ?? []) as RecordItem[]
    } catch (error: any) {
      alert(error.message)
    }
  }

  function fetchCompanies() {
    return usersApi()
      .get('/companies')
      .then((result) => {
        companies.value = (result?.data?.data?.items ?? []) as RecordItem[]
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function updateUser(user: RecordItem) {
    const index = users.value.findIndex((item) => item.id === user.id)
    if (index >= 0) users.value[index] = { ...users.value[index], ...user }
  }

  function updateCompany(company: RecordItem) {
    const index = companies.value.findIndex((item) => item.id === company.id)
    if (index >= 0) companies.value[index] = { ...companies.value[index], ...company }
  }

  return {
    users,
    fetchUsers,
    companies,
    fetchCompanies,
    updateUser,
    updateCompany,
  }
})
