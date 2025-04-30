import { create } from 'zustand'
import { StoryStoreType, StoryType } from '../types/story.type'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

const baseUrl = `v1/story/`

export const useStoryStore = create<StoryStoreType>()((set, get) => ({
  datas: [],
  getAll: async (query = '') => {
    const url = baseUrl + `get-all?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<StoryType>>(url)
    ).data
    set({ datas: resp.data.results })
    return resp
  },
  getDatasByMe: async (query = '') => {
    const url = baseUrl + `get-me?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<StoryType>>(url)
    ).data
    set({ datas: resp.data.results })
    return resp
  },
  create: async (data) => {
    const url = baseUrl + `create`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<StoryType>>(url, data)
    ).data
    if (resp.status === 201) {
      set({ datas: [resp.data, ...get().datas] })
    }
    return resp
  },
  deleteById: async (id) => {
    const url = baseUrl + `delete/${id}`
    const resp = (
      await axiosInstance.delete<ResponseSuccessType<StoryType>>(url)
    ).data
    if (resp.status === 200) {
      set({ datas: get().datas.filter((item) => item._id !== id) })
    }
    return resp
  },
}))
