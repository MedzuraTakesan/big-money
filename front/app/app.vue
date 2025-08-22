<template>
  <div class="app">
    <AppHeader />
    <AppMain />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader/index.vue'
import AppMain from '@/components/AppMain/index.vue'
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
