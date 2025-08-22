<template>
  <div class="loading-spinner">
    <div class="spinner">
      <div class="spinner__circle"></div>
      <div class="spinner__circle"></div>
      <div class="spinner__circle"></div>
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: 'Загрузка...'
});
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
