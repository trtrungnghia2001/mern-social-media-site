import { UserType } from '@/features/authentication/types/user.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type PostType = {
  _id: string
  user: UserType | null
  content: string
  file_url: string
  status: string
  createdAt: string
  updatedAt: string

  isLiked: boolean
  isSaved: boolean
  total_likes: number
  total_comments: number
}

export type PostFormStoreType = {
  open: boolean
  post: PostType | null
  handleClose: () => void
  handleOpen: () => void
  handleUpdate: (data: PostType | null) => void
}

export type PostStoreType = {
  datas: PostType[]
  getAll: (query?: string) => Promise<ResponseSuccessListType<PostType>>
  getDatasByMe: (query?: string) => Promise<ResponseSuccessListType<PostType>>
  create: (data: FormData) => Promise<ResponseSuccessType<PostType>>
  updateById: (
    id: string,
    data: FormData,
  ) => Promise<ResponseSuccessType<PostType>>
  deleteById: (id: string) => Promise<ResponseSuccessType<PostType>>

  // save
  posts_save: PostType[]
  getSaveByMe: (query?: string) => Promise<ResponseSuccessListType<PostType>>
  saveUnsave: (post: string) => Promise<ResponseSuccessType<PostType>>

  // like
  posts_like: PostType[]
  getLikeByMe: (query?: string) => Promise<ResponseSuccessListType<PostType>>
  likeUnlike: (post: string) => Promise<ResponseSuccessType<PostType>>
}
