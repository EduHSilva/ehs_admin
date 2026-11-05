<script setup>
import { mdiAccountGroupOutline } from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import CardBox from '../components/CardBox.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import CardBoxComponentEmpty from '../components/CardBoxComponentEmpty.vue'
import TableUsers from "../components/TableUsers.vue";
import { clientsStore } from '../stores/clientsStore'
import TableCompanies from "../components/TableCompanies.vue";

const store = clientsStore()
await Promise.all([store.fetchUsers(), store.fetchCompanies()])
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccountGroupOutline" title="Usuários" main>
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <CardBoxComponentEmpty v-if="store.users.length === 0" />
        <TableUsers v-else checkable />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountGroupOutline" title="Empresas" main>
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <CardBoxComponentEmpty v-if="store.companies.length === 0" />
        <TableCompanies v-else checkable />
      </CardBox>


    </SectionMain>
  </LayoutAuthenticated>
</template>
