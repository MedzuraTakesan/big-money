<template>
  <button @click="$emit('click')" class="search-button">
    <span>Найти</span>
  </button>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'click'): void;
}

defineEmits<Emits>();
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
