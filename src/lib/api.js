import axios from 'axios'

// URL relative : fonctionne sur n'importe quel port sans config DB/JWT
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Intercepteur token (désactivé en mode local mock — pas de vérification JWT côté serveur)
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
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur erreurs — redirection 401 désactivée en mode local (pas de JWT réel)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   if (typeof window !== 'undefined') {
    //     localStorage.removeItem('token')
    //     localStorage.removeItem('user')
    //     window.location.href = '/auth/login'
    //   }
    // }
    return Promise.reject(error)
  }
)

export default api
