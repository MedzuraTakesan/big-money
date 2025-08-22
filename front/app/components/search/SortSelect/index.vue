<template>
  <div class="sort-select-wrapper">
    <div class="sort-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
      </svg>
    </div>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" class="sort-select">
      <option value="reviews">По отзывам</option>
      <option value="price">По цене</option>
      <option value="name">По названию</option>
      <option value="discount">По скидке</option>
      <option value="rating">По рейтингу</option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
