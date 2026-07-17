import axios from 'axios'

// Same-origin by default so the browser never hits CORS.
// Next.js rewrites /api/* → BACKEND_URL (see next.config.js).
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isAuthRequest = url.includes('/auth/')
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      isAuthRequest &&
      !window.location.pathname.startsWith('/auth/')
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
