<template>
  <div class="search-container">
    <input
        class="search-container__input"
        placeholder="Введите запрос"
        v-model="searchText"
    >
    <select v-model="sortBy" class="search-container__select">
      <option value="reviews">По отзывам</option>
      <option value="price">По цене</option>
      <option value="name">По названию</option>
    </select>
    <button @click="fetchProducts">Поискать...</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from "~/stores/search";

const searchText = ref('')
const sortBy = ref('reviews')
const searchStore = useSearchStore()

const fetchProducts = () => {
  searchStore.fetchProducts(searchText.value, sortBy.value)
}

</script>

<style scoped>

</style>