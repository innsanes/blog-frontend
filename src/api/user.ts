import request from './request';

export function login(data: { name: string, password: string }) {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  })
}