import request from './request';

export function bloglist() {
  return request({
    url: '/blog/list',
    method: 'get',
  })
}

export function fetchBlog(id: number) {
  return request({
    url: `/blog/${id}`,
    method: 'get',
  })
}

export function blogupdate(data: { id: number, name: string, content: string }) {
  return request({
    url: '/blog/update',
    method: 'put',    
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  })
}

export function blogcreate(data: { name: string, content: string }) {
  return request({
    url: '/blog/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  })
}