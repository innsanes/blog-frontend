import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
    state: () => ({ 
        blogId: 0,
        blogName: '', 
        blogContent: '',
    }),
  })