import axios, { AxiosError } from 'axios'
import ENV_CONFIG from './env.config'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { refreshTokenApi } from '@/features/authentication/services/auth.service'

const axiosInstance = axios.create({
  baseURL: ENV_CONFIG.URL_SERVER,
  withCredentials: true,
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  async function (response) {
    return response
  },

  async function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config
    const customError = error.response?.data

    // refresh token
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = await refreshTokenApi()

        if (refreshToken.status === 401) {
          await useAuthStore.getState().signout()

          return Promise.reject(customError)
        }
        if (refreshToken.status === 200) {
          return axiosInstance(originalRequest)
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          await useAuthStore.getState().signout()
          localStorage.setItem(`redirect_url`, window.location.pathname)
          return Promise.reject({
            status: 401,
            message: 'Please login again',
          })
        }
      }
    }

    return Promise.reject(customError)
  },
)

export default axiosInstance
