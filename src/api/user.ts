import request from './request';

export function login(data: { name: string, password: string }) {
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}