// 1. 判断是否登录 || token 是否存在
// 2. 登录时，直接渲染相应页面组件
// 3. 未登录时，重定向到登录页面

// 高阶组件：把一个组件当成另外一个组件的参数传入，然后通过一定的判断，返回新的组件
import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

function AuthRoute ({ children }) {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace />
  }
}

// <AuthComponent> <Layout/> </AuthComponent>
// 登录：<><Layout/></>
// 非登录：<Navigate to="/login" replace />

export default AuthRoute 