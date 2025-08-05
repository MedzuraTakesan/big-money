export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        products: '',
        loading: false
    }),
    getters: {
        getProducts(state) {
            return state.products
        }
    },
    actions: {
        async fetchProducts(search: string) {
            this.loading = true;
            try {
                const response = await $fetch('/api/get-products', {
                    method: 'get',
                    query: {
                        search
                    }
                });

                this.products = response;
            } finally {
                this.loading = false;
            }
        }
    }
})