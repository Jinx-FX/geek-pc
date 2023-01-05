// 封装axios
// 实例化  请求拦截器 响应拦截器
import axios from 'axios'
import { getToken, removeToken } from './token'
import { history } from './history'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401) {
    // ! 跳回登录，reactRouter 默认状态下，并不支持在组件外完成路由跳转
    // ! 需要自己来实现
    // ! window.location.href = '' 实现跳转需要刷新整个页面，故而用户体验不好；
    // ! 同时违背了前端路由不向后端服务器发送请求只改变url的原则
    // 删除token
    removeToken()
    // 跳转到登录页
    history.push('/login')

  }
  return Promise.reject(error)
})

export { http }