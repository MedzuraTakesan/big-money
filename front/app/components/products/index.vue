<template>
  <div class="products-section">
    <LoadingSpinner v-if="searchStore.isLoading" text="Ищем лучшие предложения..." />
    
    <EmptyState v-else-if="getProducts.length === 0" />
    
    <div v-else class="products-grid">
      <ProductCard
        v-for="(product, index) in getProducts"
        :key="index"
        :product="product"
      />
    </div>
    
    <ReviewsModal />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore} from "~/stores/search";
import LoadingSpinner from '~/components/LoadingSpinner/index.vue';
import ProductCard from './ProductCard/index.vue';
import EmptyState from './EmptyState/index.vue';
import ReviewsModal from '../ReviewsModal/index.vue';

const searchStore = useSearchStore()
const { getProducts } = storeToRefs(searchStore)
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>