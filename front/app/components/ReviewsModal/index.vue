<template>
  <div v-if="isModalVisible" class="reviews-modal-overlay" @click="closeModal">
    <div class="reviews-modal" @click.stop>
      <div class="reviews-modal__header">
        <h2 class="reviews-modal__title">Отзывы о товаре</h2>
        <button class="reviews-modal__close" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
             <div class="reviews-modal__content">
         <div v-if="loading" class="reviews-modal__loading">
           <div class="loading-spinner"></div>
           <p>Загружаем отзывы...</p>
         </div>
         
         <div v-else-if="error" class="reviews-modal__error">
           <p>{{ error }}</p>
         </div>
         
         <div v-else-if="reviews.length === 0" class="reviews-modal__empty">
           <p>Отзывы не найдены</p>
         </div>
         
         <div v-else class="reviews-modal__list">
           <div class="reviews-modal__stats">
             <div class="stats-item">
               <span class="stats-label">Всего отзывов:</span>
               <span class="stats-value">{{ reviewsStore.reviewsCount }}</span>
             </div>
             <div class="stats-item">
               <span class="stats-label">Средний рейтинг:</span>
               <span class="stats-value">{{ reviewsStore.averageRating }}/5</span>
             </div>
           </div>
          <div 
            v-for="(review, index) in reviews" 
            :key="index" 
            class="review-item"
          >
            <div class="review-item__header">
              <div class="review-item__author">{{ review.author }}</div>
              <div class="review-item__rating">
                <div class="stars">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    class="star"
                    :class="{ 'star--filled': star <= review.rating }"
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
            <div class="review-item__text">{{ review.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'
import { storeToRefs } from 'pinia'

const reviewsStore = useReviewsStore()
const { reviews, loading, error, isModalVisible } = storeToRefs(reviewsStore)

const closeModal = () => {
  reviewsStore.closeReviewsModal();
};
</script>

<style lang="scss" scoped>
.reviews-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.reviews-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.reviews-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.reviews-modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.reviews-modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
}

.reviews-modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.reviews-modal__loading,
.reviews-modal__error,
.reviews-modal__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.reviews-modal__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reviews-modal__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stats-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stats-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.review-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.review-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-item__author {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.review-item__rating {
  display: flex;
  align-items: center;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 16px;
  transition: color 0.2s;
  
  &--filled {
    color: #fbbf24;
  }
}

.review-item__text {
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
