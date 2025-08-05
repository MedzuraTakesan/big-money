<template>
  <div class="products">
    <div
        class="products-card"
        v-for="(product, index) in getProducts"
        :key="index"
    >
      <img class="products-card__img" :src="product.cardImg">
      <p class="products-card__marketplace">{{ product.marketplace }}</p>
      <p class="products-card__name">{{ product.name }}</p>
      <div>
        <ins class="products-card__sale">{{ product.sale }}</ins>
      </div>
      <div>
        <del class="products-card__price">{{ product.price }}</del>
      </div>
      <a :href="product.cardLink"> товар в {{ product.marketplace}} </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore} from "~/stores/search";

const searchStore = useSearchStore()
const { getProducts } = storeToRefs(searchStore)
</script>

<style lang="scss" scoped>
.products {
  display: flex;
  flex-wrap: wrap;
}
.products-card {
  margin: 20px;
  border-radius: 10px;
  overflow: hidden;
  padding: 5px;
  background-color: #fff;
}
.products-card__img {
  max-width: 200px;
}
</style>