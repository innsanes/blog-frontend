import request from './request';
import { type Blog } from '../stores/blog';

// 博客列表查询参数类型
export interface BlogListParams {
  category?: string;        // 分类过滤
  useCursor?: boolean; // 是否使用游标分页
  page?: number;       // 页码（分页模式）
  size: number;        // 每页大小
  cursor?: number;     // 游标ID（游标模式）
  forward?: boolean;   // 游标方向（游标模式）
}

// 博客列表项类型（继承自Blog，但可能不包含content以节省流量）
export interface BlogListItem extends Omit<Blog, 'content'> {
  content?: string; // 列表中可能不包含完整内容
  summary?: string; // 博客摘要
}

// 博客列表响应类型
export interface BlogListResponse {
  data: BlogListItem[];
  count: number;
}

// 博客详情类型（与Blog完全一致）
export type BlogDetail = Blog;

// 搜索结果类型
export interface BlogSearchResult {
  id: number;
  name: string;
  content: string;
  createTime: string;
  updateTime: string;
  category?: string;
  summary?: string;
  matchCount: number; // 匹配次数
}

// 搜索响应类型
export interface BlogSearchResponse {
  data: BlogSearchResult[];
  count: number;
}

export function bloglist(params?: BlogListParams) {
  return request({
    url: '/blog',
    method: 'get',
    params: params
  })
}

export function fetchBlog(id: number) {
  return request({
    url: `/blog/${id}`,
    method: 'get',
  })
}

export function searchBlogs(query: string) {
  return request({
    url: '/blog/search',
    method: 'get',
    params: { 
      search: query,
      size: 20,
    }
  })
}