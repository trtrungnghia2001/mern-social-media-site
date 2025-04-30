import { UserType } from '@/features/authentication/types/user.type'
import { CommentType } from '@/features/comment/types/comment.type'
import { PostType } from '@/features/post/types/post.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type ActivityType = {
  _id: string
  user: UserType
  post: PostType
  comment: CommentType
  createdAt: string
  updateAd: string
}
export type ActivityStoreType = {
  activities: ActivityType[]
  getActivitiesByUser: (
    query?: string,
  ) => Promise<ResponseSuccessListType<ActivityType>>
  unLike: (id: string) => Promise<ResponseSuccessType<ActivityType>>
}
