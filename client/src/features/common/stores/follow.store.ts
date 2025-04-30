import { create } from 'zustand'
import { FollowStoreType, FollowType } from '../types/follow.type'
import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessType } from '@/utils/type'

const baseUrl = `v1/follow/`

export const useFollowStore = create<FollowStoreType>()((set, get) => ({
  followers: [],
  following: [],
  followUnfollow: async (followingId: string) => {
    const url = baseUrl + `follow-unfollow`
    const resp = (
      await axiosInstance.post<ResponseSuccessType<FollowType>>(url, {
        following: followingId,
      })
    ).data

    if (resp.status === 201) {
      set({
        following: [resp.data, ...get().following],
      })
    }
    return resp
  },
}))
