import { UserType } from '@/features/authentication/types/user.type'
import { ResponseSuccessType } from '@/utils/type'

export type FollowType = {
  follower: UserType
  following: UserType
  createdAt: string
  updatedAt: string
}

export type FollowStoreType = {
  followers: FollowType[]
  following: FollowType[]
  followUnfollow: (
    followingId: string,
  ) => Promise<ResponseSuccessType<FollowType>>
}
