# Использование Store для отзывов

## Обзор

Store `useReviewsStore` управляет всем состоянием, связанным с отзывами товаров. Это включает загрузку отзывов, управление модальным окном и обработку ошибок.

## Импорт и использование

```typescript
import { useReviewsStore } from '~/stores/reviews'
import { storeToRefs } from 'pinia'

const reviewsStore = useReviewsStore()
const { reviews, loading, error, isModalVisible } = storeToRefs(reviewsStore)
```

## State

```typescript
interface ReviewsState {
  reviews: Review[]           // Массив отзывов
  loading: boolean           // Состояние загрузки
  error: string | null       // Ошибка, если есть
  isModalVisible: boolean    // Видимость модального окна
  selectedProductUrl: string // URL выбранного товара
}
```

## Getters

### `hasReviews`
Проверяет, есть ли отзывы:
```typescript
const hasReviews = reviewsStore.hasReviews // boolean
```

### `reviewsCount`
Количество отзывов:
```typescript
const count = reviewsStore.reviewsCount // number
```

### `averageRating`
Средний рейтинг отзывов:
```typescript
const avgRating = reviewsStore.averageRating // number (0-5)
```

## Actions

### `openReviewsModal(productUrl: string)`
Открывает модальное окно и загружает отзывы:
```typescript
reviewsStore.openReviewsModal('https://wildberries.ru/catalog/123')
```

### `closeReviewsModal()`
Закрывает модальное окно и очищает данные:
```typescript
reviewsStore.closeReviewsModal()
```

### `fetchReviews(productUrl: string)`
Загружает отзывы для указанного товара:
```typescript
await reviewsStore.fetchReviews('https://wildberries.ru/catalog/123')
```

### `clearReviews()`
Очищает все данные отзывов:
```typescript
reviewsStore.clearReviews()
```

### `isReviewsSupported(url: string)`
Проверяет, поддерживается ли получение отзывов для URL:
```typescript
const supported = reviewsStore.isReviewsSupported(url) // boolean
```

## Примеры использования

### В компоненте ProductCard
```vue
<script setup>
import { useReviewsStore } from '~/stores/reviews'

const reviewsStore = useReviewsStore()

const showReviews = () => {
  reviewsStore.openReviewsModal(props.product.cardLink)
}

const isSupported = computed(() => 
  reviewsStore.isReviewsSupported(props.product.cardLink)
)
</script>
```

### В компоненте ReviewsModal
```vue
<script setup>
import { useReviewsStore } from '~/stores/reviews'
import { storeToRefs } from 'pinia'

const reviewsStore = useReviewsStore()
const { reviews, loading, error, isModalVisible } = storeToRefs(reviewsStore)

const closeModal = () => {
  reviewsStore.closeReviewsModal()
}
</script>

<template>
  <div v-if="isModalVisible">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>Отзывов: {{ reviewsStore.reviewsCount }}</p>
      <p>Средний рейтинг: {{ reviewsStore.averageRating }}/5</p>
      <!-- Список отзывов -->
    </div>
  </div>
</template>
```

## Преимущества использования Store

1. **Централизованное управление состоянием** - все данные об отзывах в одном месте
2. **Разделение ответственности** - бизнес-логика отделена от UI
3. **Переиспользование** - store можно использовать в любом компоненте
4. **Реактивность** - автоматическое обновление UI при изменении данных
5. **Отладка** - легко отслеживать изменения состояния
6. **Тестируемость** - store можно тестировать независимо от компонентов

## Типы данных

```typescript
interface Review {
  author: string  // Имя автора отзыва
  text: string    // Текст отзыва
  rating: number  // Рейтинг (1-5)
}
```
