import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
    state: () => ({ 
        editBlogId: 0,
        editBlogName: '', 
        editBlogContent: '',
    }),
  })