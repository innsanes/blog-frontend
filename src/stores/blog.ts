import { defineStore } from 'pinia'

// Blog类型定义（与API保持一致）
export interface Blog {
  id: number;
  name: string;
  content: string;
  summary?: string;      // 博客摘要
  categories: string[];
  view: number;
  characters: number;
  createTime: number;
  updateTime: number;
}

// 默认的空blog对象
const defaultBlog: Blog = {
  id: 0,
  name: '',
  content: '',
  summary: '',
  categories: [],
  view: 0,
  characters: 0,
  createTime: 0,
  updateTime: 0
}

export const useBlogStore = defineStore('blog', {
  state: () => ({
    // 当前查看的博客
    currentBlog: { ...defaultBlog } as Blog,
    // 是否正在加载
    loading: false,
  }),

  getters: {
    // 获取当前博客ID
    blogId: (state) => state.currentBlog.id,
    // 获取当前博客名称
    blogName: (state) => state.currentBlog.name,
    // 获取当前博客内容
    blogContent: (state) => state.currentBlog.content,
    // 获取当前博客摘要
    blogSummary: (state) => state.currentBlog.summary,
    // 获取当前博客分类
    blogCategories: (state) => state.currentBlog.categories,
    // 获取当前博客浏览数
    blogView: (state) => state.currentBlog.view,
    // 获取当前博客创建时间
    blogCreateTime: (state) => state.currentBlog.createTime,
    // 获取当前博客修改时间
    blogUpdateTime: (state) => state.currentBlog.updateTime,
    // 获取当前博客字符数
    blogCharacters: (state) => state.currentBlog.characters,
    // 检查是否为新博客
    isNewBlog: (state) => state.currentBlog.id === 0,
  },

  actions: {
    // 设置当前博客
    setBlog(blog: Blog) {
      this.currentBlog = { ...blog }
    },

    // 更新博客的部分字段
    updateBlog(updates: Partial<Blog>) {
      this.currentBlog = { ...this.currentBlog, ...updates }
    },

    // 重置为默认博客
    resetBlog() {
      this.currentBlog = { ...defaultBlog }
    },

    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // 创建新博客（保留当前内容但ID为0）
    createNewBlog() {
      this.currentBlog = {
        ...this.currentBlog,
        id: 0,
        createTime: 0,
        updateTime: 0
      }
    }
  }
})