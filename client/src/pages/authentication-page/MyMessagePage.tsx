import WrapperComponent from '@/components/layout/WrapperComponent'
import MessageSidebar from '@/features/message/components/MessageSidebar'
import { useMemo } from 'react'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { Outlet, useParams } from 'react-router-dom'

const MyMessagePage = () => {
  const h_header = document.getElementById('header')?.offsetHeight || 0
  const height = useMemo(() => {
    return `calc(100vh - ${h_header + 24 + 24}px)`
  }, [h_header])
  const { id } = useParams()
  return (
    <WrapperComponent className="flex items-start gap-4">
      {/* sidebar */}
      <MessageSidebar className="hidden md:block sticky top-0 " open />
      {/* messages */}
      <div
        id="chat-container"
        className="flex-1 w-full"
        style={{ height: height }}
      >
        {!id && (
          <div className="my-10 flex flex-col items-center justify-between">
            <IoChatbubbleEllipses className="animate-bounce" size={32} />
            <h4>Welcome to chat</h4>
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
        <Outlet />
      </div>
    </WrapperComponent>
  )
}

export default MyMessagePage
