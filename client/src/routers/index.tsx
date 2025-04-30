import AuthLayout from '@/components/layout/AuthLayout'
import AuthProtectedRouter from '@/components/layout/AuthProtectedRouter'
import ChangePasswordForm from '@/features/authentication/components/ChangePasswordForm'
import UpdateProfileForm from '@/features/authentication/components/UpdateProfileForm'
import MyActivityPage from '@/pages/authentication-page/MyActivityPage'
import MyCommentPage from '@/pages/authentication-page/MyCommentPage'
import MyMessageIdPage from '@/pages/authentication-page/MyMessageIdPage'
import MyMessagePage from '@/pages/authentication-page/MyMessagePage'
import MyNotificationPage from '@/pages/authentication-page/MyNotificationPage'
import MyPostPage from '@/pages/authentication-page/MyPostPage'
import MySavePage from '@/pages/authentication-page/MySavePage'
import MyStoryPage from '@/pages/authentication-page/MyStoryPage'
import HomePage from '@/pages/home-page'
import NotFoundPage from '@/pages/NotFoundPage'
import ProfileIdPage from '@/pages/profile-id-page'
import SearchPage from '@/pages/search-page'
import SearchPostPage from '@/pages/search-page/SearchPostPage'
import SearchUserPage from '@/pages/search-page/SearchUserPage'
import SigninSignupPage from '@/pages/signin-signup-page'
import { memo } from 'react'
import { useRoutes } from 'react-router-dom'

const MainRouter = () => {
  const router = useRoutes([
    {
      path: '*',
      element: <NotFoundPage />,
    },
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'signin',
      element: <SigninSignupPage />,
    },
    {
      path: 'signup',
      element: <SigninSignupPage />,
    },
    {
      path: 'profile/:id',
      element: <ProfileIdPage />,
    },
    {
      path: 'search',
      element: <SearchPage />,
    },
    {
      path: 'search/post',
      element: <SearchPostPage />,
    },
    {
      path: 'search/user',
      element: <SearchUserPage />,
    },

    {
      element: <AuthProtectedRouter />,
      children: [
        {
          path: `messages`,
          element: <MyMessagePage />,
          children: [
            {
              path: ':id',
              element: <MyMessageIdPage />,
            },
          ],
        },
        {
          path: 'me/*',
          element: <AuthLayout />,
          children: [
            {
              path: 'update-profile',
              element: <UpdateProfileForm />,
            },
            {
              path: 'change-password',
              element: <ChangePasswordForm />,
            },
            {
              path: 'post',
              element: <MyPostPage />,
            },
            {
              path: 'saved',
              element: <MySavePage />,
            },
            {
              path: 'activity',
              element: <MyActivityPage />,
            },
            {
              path: 'comment',
              element: <MyCommentPage />,
            },
            {
              path: 'stories',
              element: <MyStoryPage />,
            },
            {
              path: 'notifications',
              element: <MyNotificationPage />,
            },
          ],
        },
      ],
    },
  ])

  return router
}

export default memo(MainRouter)
