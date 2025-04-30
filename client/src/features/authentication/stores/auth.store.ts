import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { AuthStoreType } from '../types/auth.type'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessType } from '@/utils/type'
import { UserType } from '../types/user.type'
import ENV_CONFIG from '@/configs/env.config'
import axios from 'axios'
import { useSocketioStore } from '@/features/socket.io/stores/soket.store'

const baseUrl = `auth/`

export const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,

        signup: async (data) => {
          const url = baseUrl + `signup`
          const response = await (
            await axiosInstance.post<ResponseSuccessType>(url, data)
          ).data
          return response
        },
        signin: async (data) => {
          const url = baseUrl + `signin`
          const response = await (
            await axiosInstance.post<
              ResponseSuccessType<{
                user: UserType
              }>
            >(url, data)
          ).data
          if (response.status === 200) {
            set({ user: response.data.user, isAuthenticated: true })
            useSocketioStore.getState().connectSocket()
          }
          return response
        },
        signout: async () => {
          const url = baseUrl + `signout`
          const response = await (
            await axiosInstance.delete<ResponseSuccessType>(url)
          ).data
          set({ user: null, isAuthenticated: false })

          useSocketioStore.getState().disconnectSocket()
          return response
        },
        forgotPassword: async (data) => {
          const url = baseUrl + `forgot-password`
          const response = await (
            await axiosInstance.post<ResponseSuccessType>(url, data)
          ).data
          return response
        },
        resetPassword: async (data) => {
          const url = baseUrl + `reset-password`
          const response = await (
            await axiosInstance.post<ResponseSuccessType>(url, data)
          ).data
          return response
        },

        signinWithPassport: async (social: string) => {
          const url = ENV_CONFIG.URL_SERVER + `passport/` + social
          window.open(url, '_self')
        },
        signinWithPasspostSuccess: async () => {
          const url = ENV_CONFIG.URL_SERVER + `passport/signin-passport/success`
          const response = await (
            await axios.get<
              ResponseSuccessType<{
                user: UserType
              }>
            >(url, {
              withCredentials: true,
            })
          ).data
          if (response.status === 200) {
            set({ user: response.data.user, isAuthenticated: true })
            useSocketioStore.getState().connectSocket()
          }
          return response
        },

        getMe: async () => {
          const url = baseUrl + `get-me`
          const response = await (
            await axiosInstance.get<ResponseSuccessType<UserType>>(url)
          ).data
          return response
        },
        updataMe: async (data) => {
          const url = baseUrl + `update-me`
          const response = await (
            await axiosInstance.put<ResponseSuccessType<UserType>>(url, data)
          ).data
          if (response.status === 200) {
            set({ user: response.data })
          }
          return response
        },
        changePassword: async (data) => {
          const url = baseUrl + `change-password`
          const response = await (
            await axiosInstance.put<ResponseSuccessType>(url, data)
          ).data
          return response
        },
      }),
      {
        name: 'auth',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
)
