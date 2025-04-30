import { create } from 'zustand'
import { ActivityStoreType, ActivityType } from '../types/activity.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'
import axiosInstance from '@/configs/axios.config'

const baseUrl = `v1/activity/`

export const useActivityStore = create<ActivityStoreType>()((set) => ({
  activities: [],
  getActivitiesByUser: async (query = '') => {
    const url = baseUrl + `get-me?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<ActivityType>>(url)
    ).data
    set({ activities: resp.data.results })
    return resp
  },
  unLike: async (id) => {
    const url = baseUrl + `unlike/` + id
    const resp = await (
      await axiosInstance.delete<ResponseSuccessType<ActivityType>>(url)
    ).data
    if (resp.status === 200) {
      set((state) => ({
        activities: state.activities.filter((activity) => activity._id !== id),
      }))
    }
    return resp
  },
}))
