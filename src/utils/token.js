const TOKEN_KEY = 'geek_pc'

const getToken = () => window.localStorage.getItem(TOKEN_KEY)
const setToken = token => window.localStorage.setItem(TOKEN_KEY, token)
const removeToken = () => window.localStorage.removeItem(TOKEN_KEY)

export { getToken, setToken, removeToken }