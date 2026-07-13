<script setup>
import UserDetailView from '~/src/views/UserDetailView.vue'
const route = useRoute()
useHead({ title: 'Detalhes do usuário' })
</script>
<template><UserDetailView :id="route.params.id" /></template>
