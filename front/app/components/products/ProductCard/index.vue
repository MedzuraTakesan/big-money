<template>
  <div class="product-card" :style="cardStyle">
    <div class="product-card__overlay">
      <div class="product-card__header">
        <div class="marketplace-badge">
          {{ getMarketplaceBadge(product.marketplace) }}
        </div>
      </div>
      
      <div class="product-card__content">
        <h3 class="product-card__name">{{ product.name }}</h3>
        
        <div class="product-card__pricing">
          <div class="current-price">{{ formatPrice(Number(product.price) || Number(product.sale)) }}</div>
          <div v-if="product.sale && product.price && Number(product.sale) > Number(product.price)" class="original-price">{{ formatPrice(Number(product.sale)) }}</div>
          <div v-if="product.sale && product.price && Number(product.sale) > Number(product.price)" class="discount-badge">
            -{{ calculateDiscount(Number(product.sale), Number(product.price)) }}%
          </div>
        </div>
        
        <a
          :href="product.cardLink"
          target="_blank"
          rel="noopener noreferrer"
          class="product-card__link"
        >
          Перейти к товару в {{ product.marketplace }}
        </a>
      </div>
    </div>
    
    <div v-if="!product.cardImg" class="product-image-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 15L16 10L5 21" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  cardImg?: string;
  cardLink: string;
  marketplace: string;
  name: string;
  price: number | string;
  reviews?: string;
  reviewsCount: number | string;
  sale?: number | string;
}

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const cardStyle = computed(() => {
  if (props.product.cardImg) {
    return {
      backgroundImage: `url(${props.product.cardImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }
  return {};
});

const getMarketplaceBadge = (marketplace: string) => {
  if (marketplace.toLowerCase().includes('xiaomi')) {
    return 'MI XIAOMI';
  }
  return marketplace.toUpperCase();
}

const formatPrice = (price: number | string) => {
  const numPrice = Number(price);
  if (numPrice === 0 || isNaN(numPrice)) return 'Цена не указана';
  return new Intl.NumberFormat('ru-RU').format(numPrice) + ' ₽';
}

const calculateDiscount = (originalPrice: number | string, discountedPrice: number | string) => {
  const origPrice = Number(originalPrice);
  const discPrice = Number(discountedPrice);
  if (!origPrice || !discPrice || origPrice <= discPrice) return 0;
  return Math.round(((origPrice - discPrice) / origPrice) * 100);
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
