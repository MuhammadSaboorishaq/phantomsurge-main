import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ADMIN_ROUTES } from '@/lib/constants'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.root} state={{ from: location }} replace />
  }

  return <>{children}</>
}
