<template>
  <div class="search-section">
    <div class="search-container">
      <SearchInput 
        v-model="searchText"
        @search="fetchProducts"
      />
      
      <div class="search-controls">
        <SortSelect v-model="sortBy" />
        <SearchButton @click="fetchProducts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from "~/stores/search";
import SearchInput from './SearchInput.vue';
import SortSelect from './SortSelect.vue';
import SearchButton from './SearchButton.vue';

const searchText = ref('')
const sortBy = ref('reviews')
const searchStore = useSearchStore()

const fetchProducts = () => {
  if (searchText.value.trim()) {
    searchStore.fetchProducts(searchText.value, sortBy.value)
  }
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>