<template>
  <div class="app">
    <search />
    <products />
  </div>
</template>

<script setup lang="ts">
import search from '@/components/search/index.vue'
import products from '@/components/products/index.vue'

</script>

<style lang="scss" scoped>
.app {
  background-color: #f5f7fa;
}
</style>
