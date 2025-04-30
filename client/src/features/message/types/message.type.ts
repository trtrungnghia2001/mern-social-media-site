import { UserType } from '@/features/authentication/types/user.type'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'

export type MessageType = {
  _id: string
  sender: UserType
  receiver: UserType
  message: string
  file_url: string
  createdAt: string
  updatedAt: string
}

export type MessageStoreType = {
  messages: MessageType[]
  setMessages: (messages: MessageType[]) => void
  create: (data: FormData) => Promise<ResponseSuccessType<MessageType>>
  getChatUser: (query?: string) => Promise<ResponseSuccessListType<UserType>>
  getChatByUserId: (
    userId: string,
  ) => Promise<ResponseSuccessListType<MessageType>>
}
