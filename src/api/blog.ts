import request from './request';

// 博客列表查询参数类型
export interface BlogListParams {
  tag?: string;        // 标签过滤
  useCursor?: boolean; // 是否使用游标分页
  page?: number;       // 页码（分页模式）
  size: number;        // 每页大小
  cursor?: number;     // 游标ID（游标模式）
  forward?: boolean;   // 游标方向（游标模式）
}

// 博客列表项类型
export interface BlogListItem {
  id: number;
  name: string;
  tags: string[];
  createTime: number;
  updateTime: number;
}

// 博客列表响应类型
export interface BlogListResponse {
  data: BlogListItem[];
  count: number;
}

// 博客详情类型
export interface BlogDetail {
  id: number;
  name: string;
  content: string;
  tags?: string[];
  createTime?: number;
  updateTime?: number;
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