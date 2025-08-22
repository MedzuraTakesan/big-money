import { defineStore } from 'pinia'

interface Review {
  author: string
  text: string
  rating: number
}

interface ReviewsState {
  reviews: Review[]
  loading: boolean
  error: string | null
  isModalVisible: boolean
  selectedProductUrl: string
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    loading: false,
    error: null,
    isModalVisible: false,
    selectedProductUrl: ''
  }),

  getters: {
    hasReviews: (state) => state.reviews.length > 0,
    reviewsCount: (state) => state.reviews.length,
    averageRating: (state) => {
      if (state.reviews.length === 0) return 0
      const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0)
      return Math.round((totalRating / state.reviews.length) * 10) / 10
    }
  },

  actions: {
    /**
     * Открывает модальное окно отзывов для указанного товара
     */
    openReviewsModal(productUrl: string) {
      this.selectedProductUrl = productUrl
      this.isModalVisible = true
      this.fetchReviews(productUrl)
    },

    /**
     * Закрывает модальное окно отзывов
     */
    closeReviewsModal() {
      this.isModalVisible = false
      this.selectedProductUrl = ''
      this.clearReviews()
    },

    /**
     * Очищает данные отзывов
     */
    clearReviews() {
      this.reviews = []
      this.error = null
    },

    /**
     * Загружает отзывы для указанного товара
     */
    async fetchReviews(productUrl: string) {
      if (!productUrl) return

      this.loading = true
      this.error = null
      this.reviews = []

      try {
        const response = await fetch(`/api/get-reviews?url=${encodeURIComponent(productUrl)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          this.reviews = data.data
        } else {
          this.error = data.error || 'Ошибка при загрузке отзывов'
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        this.error = err instanceof Error ? err.message : 'Ошибка при загрузке отзывов'
      } finally {
        this.loading = false
      }
    },

    /**
     * Проверяет, поддерживается ли получение отзывов для указанного URL
     */
    isReviewsSupported(url: string): boolean {
      if (!url) return false
      return url.includes('wildberries.ru') || 
             url.includes('wb.ru') || 
             url.includes('ozon.ru')
    }
  }
})
