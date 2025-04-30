import { UserType } from '@/features/authentication/types/user.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type StoryType = {
  _id: string
  user: UserType | null
  file_url: string
  createdAt: string
  updatedAt: string
}

export type StoryFormStoreType = {
  open: boolean
  story: StoryType | null
  handleClose: () => void
  handleOpen: () => void
}
export type StoryPreviewStoreType = {
  open: boolean
  story: StoryType | null
  handleClose: () => void
  handleOpen: () => void
  setStory: (data: StoryType | null) => void
}
export type StoryStoreType = {
  datas: StoryType[]
  getAll: (query?: string) => Promise<ResponseSuccessListType<StoryType>>
  getDatasByMe: (query?: string) => Promise<ResponseSuccessListType<StoryType>>
  create: (data: FormData) => Promise<ResponseSuccessType<StoryType>>
  deleteById: (id: string) => Promise<ResponseSuccessType<StoryType>>
}
