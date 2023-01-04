import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'
class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  async getUserInfo () {
    const res = await http.get('/user/profile')
    this.userInfo = res.data
  }
}

export default UserStore