import { create } from 'zustand'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'
import { PostStoreType, PostType } from '../types/post.type'
import {
  ReactQueryInfinitePostAdd,
  ReactQueryInfinitePostEdit,
  ReactQueryInfinitePostRemove,
} from '@/lib/react-query.lib'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

const baseUrl = `v1/post/`

export const usePostStore = create<PostStoreType>()((set, get) => ({
  datas: [],
  getAll: async (query = '') => {
    const url = baseUrl + `get-all?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<PostType>>(url)
    ).data
    set({ datas: resp.data.results })
    return resp
  },
  getDatasByMe: async (query = '') => {
    const url = baseUrl + `get-me?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<PostType>>(url)
    ).data
    if (resp.status === 200) {
      set({ datas: resp.data.results })
    }
    return resp
  },
  create: async (data) => {
    const url = baseUrl + `create`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<PostType>>(url, data)
    ).data
    if (resp.status === 201) {
      set({ datas: [resp.data, ...get().datas] })

      if (useAuthStore.getState().user) {
        ReactQueryInfinitePostAdd(['posts'], resp.data)
        ReactQueryInfinitePostAdd(
          ['profile', 'posts', useAuthStore.getState().user?._id as string],
          resp.data,
        )
      }
    }
    return resp
  },
  updateById: async (id, data) => {
    const url = baseUrl + `update/${id}`
    const resp = (
      await axiosInstance.put<ResponseSuccessType<PostType>>(url, data)
    ).data
    if (resp.status === 200) {
      set({
        datas: get().datas.map((item) =>
          item._id === id ? { ...item, ...data } : item,
        ),
      })
      if (useAuthStore.getState().user) {
        ReactQueryInfinitePostEdit(['posts'], resp.data)
        ReactQueryInfinitePostEdit(
          ['profile', 'posts', useAuthStore.getState().user?._id as string],
          resp.data,
        )
      }
    }
    return resp
  },
  deleteById: async (id) => {
    const url = baseUrl + `delete/${id}`
    const resp = (
      await axiosInstance.delete<ResponseSuccessType<PostType>>(url)
    ).data
    if (resp.status === 200) {
      set({
        datas: get().datas.filter((item) => item._id !== id),
        posts_save: get().posts_save.filter((item) => item._id !== id),
      })

      if (useAuthStore.getState().user) {
        ReactQueryInfinitePostRemove(['posts'], resp.data)
        ReactQueryInfinitePostRemove(
          ['profile', 'posts', useAuthStore.getState().user?._id as string],
          resp.data,
        )
      }
    }
    return resp
  },

  // save
  posts_save: [],
  getSaveByMe: async (query = '') => {
    const url = baseUrl + `get-save?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<PostType>>(url)
    ).data
    set({ posts_save: resp.data.results })
    return resp
  },
  saveUnsave: async (post) => {
    const url = baseUrl + `save-unsave`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<PostType>>(url, {
        post: post,
      })
    ).data
    if (resp.status === 201) {
      set({ posts_save: [resp.data, ...get().posts_save] })
    }
    if (resp.status === 200) {
      set({
        posts_save: get().posts_save.filter((item) => item._id !== post),
      })
    }
    return resp
  },
  // like
  posts_like: [],
  getLikeByMe: async (query = '') => {
    const url = baseUrl + `get-like?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<PostType>>(url)
    ).data
    set({ posts_like: resp.data.results })
    return resp
  },
  likeUnlike: async (post) => {
    const url = baseUrl + `like-unlike`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<PostType>>(url, {
        post: post,
      })
    ).data
    if (resp.status === 201) {
      set({ posts_like: [resp.data, ...get().posts_like] })
    }
    if (resp.status === 200) {
      set({
        posts_like: get().posts_like.filter((item) => item._id !== post),
      })
    }
    return resp
  },
}))
