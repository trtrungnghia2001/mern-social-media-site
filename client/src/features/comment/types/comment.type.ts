import { UserType } from '@/features/authentication/types/user.type'
import { PostType } from '@/features/post/types/post.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type CommentType = {
  _id: string
  user: UserType
  content: string
  file_url: string
  isLiked: boolean
  total_likes: number
  total_replies: number

  createdAt: string
  updatedAt: string

  post: PostType
  comment: CommentType
}

export type CommentStoreType = {
  comments: CommentType[]
  create: (data: FormData) => Promise<ResponseSuccessType<CommentType>>
  deleteById: (id: string) => Promise<ResponseSuccessType<CommentType>>
  getCommentsByMe: (
    query?: string,
  ) => Promise<ResponseSuccessListType<CommentType>>
  // like
  likeUnlike: (comment: string) => Promise<ResponseSuccessType<CommentType>>
}
