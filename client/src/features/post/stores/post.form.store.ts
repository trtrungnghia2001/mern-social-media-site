import { create } from 'zustand'
import { PostFormStoreType } from '../types/post.type'

export const usePostFormStore = create<PostFormStoreType>()((set) => ({
  open: false,
  post: null,
  handleClose: () => set({ open: false }),
  handleOpen: () => set({ open: true }),
  handleUpdate: (data) => set({ post: data }),
}))
