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
import SearchInput from './SearchInput/index.vue';
import SortSelect from './SortSelect/index.vue';
import SearchButton from './SearchButton/index.vue';

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