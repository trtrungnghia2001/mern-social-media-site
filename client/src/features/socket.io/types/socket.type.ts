import { Socket } from 'socket.io-client'

export type SocketioStoreType = {
  socket: Socket | null
  onlineUsers: string[]
  connectSocket: () => void
  disconnectSocket: () => void
  subscribeToMessages: (receiverId: string) => void
  unsubscribeFromMessages: () => void
}
