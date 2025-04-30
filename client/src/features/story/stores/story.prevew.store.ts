import { create } from 'zustand'
import { StoryPreviewStoreType } from '../types/story.type'

export const useStoryPreviewStore = create<StoryPreviewStoreType>()((set) => ({
  open: false,
  story: null,
  handleClose: () => set({ open: false }),
  handleOpen: () => set({ open: true }),
  setStory: (data) => set({ story: data }),
}))
