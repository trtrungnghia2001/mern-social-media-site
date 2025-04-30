import { Toaster } from 'react-hot-toast'
import axiosInstance from './configs/axios.config'
import { useAuthStore } from './features/authentication/stores/auth.store'
import MainRouter from './routers/index'
import HeaderComponent from './components/layout/HeaderComponent'
import PostCreateUpdateForm from './features/post/components/PostCreateUpdateForm'
import { useEffect } from 'react'
import StoryCreateUpateForm from './features/story/components/StoryCreateUpateForm'
import StoryCardPreview from './features/story/components/StoryCardPreview'
import ButtonToTopComponent from './components/layout/button-to-top-component'
import { useSocketioStore } from './features/socket.io/stores/soket.store'

const App = () => {
  const { connectSocket } = useSocketioStore()
  const { user, signinWithPasspostSuccess } = useAuthStore()
  axiosInstance.defaults.params = {
    _tracking_id: user?._id,
  }
  useEffect(() => {
    ;(async () => {
      if (!user) {
        await signinWithPasspostSuccess()
      }
    })()
  }, [])
  useEffect(() => {
    connectSocket()
  }, [connectSocket])

  return (
    <div>
      <HeaderComponent />
      <main className="pb-4">
        <MainRouter />
      </main>
      <Toaster />
      <ButtonToTopComponent />
      <PostCreateUpdateForm />
      <StoryCreateUpateForm />
      <StoryCardPreview />
    </div>
  )
}

export default App
