interface Product {
  name: string;
  price: number;
  reviewsCount: number;
  marketplace: string;
  cardImg?: string;
  cardLink: string;
  sale?: string;
}

export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        products: [] as Product[],
        loading: false
    }),
    getters: {
        getProducts(state): Product[] {
            return state.products
        },
        isLoading(state): boolean {
            return state.loading
        }
    },
    actions: {
        async fetchProducts(search: string, sortBy: string = 'reviews') {
            this.loading = true;
            try {
                const response = await $fetch<Product[]>('/api/get-products', {
                    method: 'get',
                    query: {
                        search,
                        sortBy
                    }
                });

                this.products = response;
            } catch (error) {
                console.error('Error fetching products:', error);
                this.products = [];
            } finally {
                this.loading = false;
            }
        },


    }
})