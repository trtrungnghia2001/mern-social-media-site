import { create } from 'zustand'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'
import axiosInstance from '@/configs/axios.config'
import {
  NotificationStoreType,
  NotificationType,
} from '../types/notification.type'

const baseUrl = `v1/notification/`

export const useNotificationStore = create<NotificationStoreType>()((set) => ({
  notifications: [],
  getNotificationsByUser: async (query = '') => {
    const url = baseUrl + `get-me?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<NotificationType>>(url)
    ).data
    set({ notifications: resp.data.results })
    return resp
  },
  deleteById: async (id) => {
    const url = baseUrl + `delete/` + id
    const resp = await (
      await axiosInstance.delete<ResponseSuccessType<NotificationType>>(url)
    ).data
    if (resp.status === 200) {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification._id !== id,
        ),
      }))
    }
    return resp
  },
  deleteByMe: async () => {
    const url = baseUrl + `delete-me`
    const resp = await (
      await axiosInstance.delete<ResponseSuccessType<NotificationType>>(url)
    ).data
    if (resp.status === 200) {
      set({
        notifications: [],
      })
    }
    return resp
  },
}))
