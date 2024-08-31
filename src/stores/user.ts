import { defineStore } from 'pinia'
import { login } from '../api/user'

export const useUserStore = defineStore('user', {
    state: () => ({ 
        id: 0, 
        name: '',
        token: '' 
    }),
    actions: {
        userlogin(data: { name: string, password: string }) {
            return login(data).then(response => {
                this.setUserInfo
                console.log(data)
                this.id = 1
                this.name = data.name
                this.token = 'fake token'
              }
            ) 
        },
    },
  })