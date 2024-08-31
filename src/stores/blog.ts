import { defineStore } from 'pinia'
import { blog } from '../api/blog'

export const useBlogStore = defineStore('blog', {
    state: () => ({ 
        editBlogId: 0,
        editBlogName: '', 
        editBlogContent: '',
    }),
  })