import WrapperComponent from '@/components/layout/WrapperComponent'
import MessageSidebar from '@/features/message/components/MessageSidebar'
import { useEffect, useRef } from 'react'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { Outlet, useParams } from 'react-router-dom'

const MyMessagePage = () => {
  const { id } = useParams()

  const mainRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const updateHeight = () => {
      const h_header = document.getElementById('header')?.offsetHeight || 0
      if (mainRef.current) {
        mainRef.current.style.height = `calc(100vh - ${h_header + 24}px)`
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return (
    <WrapperComponent>
      <div ref={mainRef} className="flex items-start gap-4 overflow-hidden">
        {/* sidebar */}
        <MessageSidebar className="hidden md:block sticky top-0 h-full" open />
        {/* messages */}
        <div className="flex-1 w-full h-full">
          {!id && (
            <div className="my-10 flex flex-col items-center justify-between">
              <IoChatbubbleEllipses className="animate-bounce" size={32} />
              <h4>Welcome to chat</h4>
              <p>Select a conversation to start messaging.</p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </WrapperComponent>
  )
}

export default MyMessagePage
