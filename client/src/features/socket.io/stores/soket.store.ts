import { create } from 'zustand'
import { SocketioStoreType } from '../types/socket.type'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import ENV_CONFIG from '@/configs/env.config'
import { io } from 'socket.io-client'
import { MessageType } from '@/features/message/types/message.type'
import { useMessageStore } from '@/features/message/stores/message.store'

export const useSocketioStore = create<SocketioStoreType>()((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    const socket = io(ENV_CONFIG.URL_SOKET, {
      query: {
        userId: user._id,
      },
      transports: ['websocket'],
      forceNew: true,
    })

    socket.connect()

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })

    set({ socket })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect()
    }
  },
  subscribeToMessages: (receiverId) => {
    const { socket } = get()

    if (!receiverId || !socket) return

    socket.on('newMessage', (newMessage: MessageType) => {
      const isMessageSentFromSelectedUser = newMessage.sender._id === receiverId
      if (!isMessageSentFromSelectedUser) return

      useMessageStore
        .getState()
        .setMessages([...useMessageStore.getState().messages, newMessage])
    })
  },

  unsubscribeFromMessages: () => {
    const socket = get().socket
    socket?.off('newMessage')
  },
}))
