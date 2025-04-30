import { create } from 'zustand'
import { CommentStoreType, CommentType } from '../types/comment.type'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

const baseUrl = `v1/comment/`

export const useCommentStore = create<CommentStoreType>()((set, get) => ({
  comments: [],
  create: async (data) => {
    const url = baseUrl + `create`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<CommentType>>(url, data)
    ).data

    if (resp.status === 201) {
      set({ comments: [resp.data, ...get().comments] })
    }
    return resp
  },
  deleteById: async (id) => {
    const url = baseUrl + `delete/${id}`
    const resp = (
      await axiosInstance.delete<ResponseSuccessType<CommentType>>(url)
    ).data
    if (resp.status === 200) {
      set({ comments: get().comments.filter((item) => item._id !== id) })
    }
    return resp
  },
  getCommentsByMe: async (query = '') => {
    const url = baseUrl + `get-me?` + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<CommentType>>(url)
    ).data
    if (resp.status === 200) {
      set({ comments: resp.data.results })
    }
    return resp
  },
  likeUnlike: async (comment) => {
    const url = baseUrl + `like-unlike`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<CommentType>>(url, {
        comment: comment,
      })
    ).data
    return resp
  },
}))
