<template>
  <div class="search-container">
    <input
        class="search-container__input"
        placeholder="Введите запрос"
        v-model="searchText"
    >
    <button @click="fetchProducts">Поискать...</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from "~/stores/search";

const searchText = ref('')
const searchStore = useSearchStore()

const fetchProducts = () => {
  searchStore.fetchProducts(searchText.value)
}

</script>

<style scoped>

</style>