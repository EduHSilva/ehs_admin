<script setup>
import UserAvatar from '../components/UserAvatar.vue'
import { getUser } from '../services/auth'

</script>

<template>
  <UserAvatar :username="getUser().username" :avatar="getUser().avatar">
    <slot />
  </UserAvatar>
</template>
