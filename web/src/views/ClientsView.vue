<script setup>
import { mdiAccountGroupOutline, mdiAlertCircleOutline } from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import CardBox from '../components/CardBox.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import NotificationBar from '../components/NotificationBar.vue'
import TableUsers from "../components/TableUsers.vue";
import { clientsStore } from '../stores/clientsStore'
import TableCompanies from "../components/TableCompanies.vue";

const store = clientsStore()
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <NotificationBar v-if="store.error" color="danger" :icon="mdiAlertCircleOutline">
        {{ store.error }}
      </NotificationBar>

      <SectionTitleLineWithButton :icon="mdiAccountGroupOutline" title="Usuários" main>
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableUsers />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountGroupOutline" title="Empresas" main>
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableCompanies />
      </CardBox>


    </SectionMain>
  </LayoutAuthenticated>
</template>
