import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false
  }),

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    startLoading() {
      this.setLoading(true);
    },

    stopLoading() {
      this.setLoading(false);
    }
  }
});