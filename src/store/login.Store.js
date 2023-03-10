// 登录模块
import { makeAutoObservable } from "mobx"
import { getToken, http, removeToken, setToken } from '@/utils'

class LoginStore {
  token = '' || getToken()
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  // getToken
  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    this.token = res.data.token
    setToken(this.token)
  }
  // login out
  loginOut = () => {
    this.token = ''
    removeToken()
  }
}
export default LoginStore