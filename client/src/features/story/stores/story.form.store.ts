import { create } from 'zustand'
import { StoryFormStoreType } from '../types/story.type'

export const useStoryFormStore = create<StoryFormStoreType>()((set) => ({
  open: false,
  story: null,
  handleClose: () => set({ open: false }),
  handleOpen: () => set({ open: true }),
}))
