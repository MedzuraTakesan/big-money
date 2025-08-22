<template>
  <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" class="sort-select">
    <option value="reviews">По отзывам</option>
    <option value="price">По цене</option>
    <option value="name">По названию</option>
  </select>
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
