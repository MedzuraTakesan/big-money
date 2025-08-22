<template>
  <div class="app">
    <AppHeader />
    <AppMain />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppMain from '@/components/AppMain.vue'
</script>

<style lang="scss" scoped>
@use './app.styles.scss';
</style>
