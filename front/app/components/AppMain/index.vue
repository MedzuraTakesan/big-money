<template>
  <main class="main">
    <div class="main__container">
      <search />
      <products />
    </div>
  </main>
</template>

<script setup lang="ts">
import search from '@/components/search/index.vue'
import products from '@/components/products/index.vue'
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
