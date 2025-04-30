import { create } from 'zustand'
import { MessageStoreType, MessageType } from '../types/message.type'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'
import { UserType } from '@/features/authentication/types/user.type'

const baseUrl = `v1/messages/`

export const useMessageStore = create<MessageStoreType>()((set, get) => ({
  messages: [],
  setMessages: (messages) => {
    set({ messages })
  },
  create: async (data) => {
    const url = baseUrl + 'create'
    const resp = (
      await axiosInstance.post<ResponseSuccessType<MessageType>>(url, data)
    ).data
    if (resp.status === 201) {
      set({ messages: [...get().messages, resp.data] })
    }
    return resp
  },
  getChatUser: async (query = '') => {
    const url = baseUrl + 'get-user?' + query
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<UserType>>(url)
    ).data
    return resp
  },
  getChatByUserId: async (userId) => {
    const url = baseUrl + 'chat-user/' + userId
    const resp = (
      await axiosInstance.get<ResponseSuccessListType<MessageType>>(url)
    ).data
    if (resp.status === 200) {
      set({ messages: resp.data.results })
    }
    return resp
  },
}))
