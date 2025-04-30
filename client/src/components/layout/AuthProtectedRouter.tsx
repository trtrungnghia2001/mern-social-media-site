import { useAuthStore } from '@/features/authentication/stores/auth.store'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AuthProtectedRouter = () => {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) return <Navigate to={`/signin`} state={location} replace />
  return <Outlet />
}

export default AuthProtectedRouter
