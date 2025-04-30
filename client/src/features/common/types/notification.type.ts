import { UserType } from '@/features/authentication/types/user.type'
import { CommentType } from '@/features/comment/types/comment.type'
import { PostType } from '@/features/post/types/post.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type NotificationType = {
  _id: string
  sender: UserType
  receiver: UserType
  post: PostType
  comment: CommentType
  content: string
  type: string
  read: boolean
  createdAt: string
  updateAd: string
}
export type NotificationStoreType = {
  notifications: NotificationType[]
  getNotificationsByUser: (
    query?: string,
  ) => Promise<ResponseSuccessListType<NotificationType>>
  deleteById: (id: string) => Promise<ResponseSuccessType<NotificationType>>
  deleteByMe: () => Promise<ResponseSuccessType<NotificationType>>
}
