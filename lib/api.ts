// API 工具函数 - 统一管理 token 和请求

const API_BASE_URL = 'http://116.57.120.171:8081'

// Token 存储键名
const TOKEN_KEY = 'auth_token'
const USER_INFO_KEY = 'user_info'

// 登录响应数据类型
export interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    expiresIn: number
    username: string
    permissionLevel: number
    roleName: string
  }
  timestamp: number
}

// 用户信息类型
export interface UserInfo {
  token: string
  expiresIn: number
  username: string
  permissionLevel: number
  roleName: string
}

// Token 管理函数
export const tokenManager = {
  // 保存 token 和用户信息
  setToken: (token: string, userInfo: Omit<UserInfo, 'token'>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify({ ...userInfo, token }))
    }
  },

  // 获取 token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  },

  // 获取用户信息
  getUserInfo: (): UserInfo | null => {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem(USER_INFO_KEY)
      if (userInfoStr) {
        try {
          return JSON.parse(userInfoStr)
        } catch {
          return null
        }
      }
    }
    return null
  },

  // 清除 token
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_INFO_KEY)
    }
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null
  },
}

// 统一的 fetch 函数，自动添加 Authorization header
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = tokenManager.getToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // 如果有 token，添加 Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  // 如果 token 过期或无效，清除本地 token
  if (response.status === 401) {
    tokenManager.clearToken()
    // 可以在这里添加跳转到登录页的逻辑
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  return response
}

// 登录函数
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: LoginResponse = await response.json()

  if (result.code !== 200) {
    throw new Error(result.message || '登录失败')
  }

  // 保存 token 和用户信息
  if (result.data) {
    tokenManager.setToken(result.data.token, {
      expiresIn: result.data.expiresIn,
      username: result.data.username,
      permissionLevel: result.data.permissionLevel,
      roleName: result.data.roleName,
    })
  }

  return result
}

