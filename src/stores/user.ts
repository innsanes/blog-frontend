import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({ 
        id: 0, 
        name: '',
        token: '' 
    }),
    getters: {
        isLogin: (state) => state.token !== '',
    },
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'user',
          storage: localStorage,
        },
      ],
    },
  })