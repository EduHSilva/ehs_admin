<script setup>
import CompanyDetailView from '~/src/views/CompanyDetailView.vue'
const route = useRoute()
useHead({ title: 'Detalhes da empresa' })
</script>
<template><CompanyDetailView :id="route.params.id" /></template>
