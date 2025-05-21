import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthCallbackPage = () => {
  const { handleAuthCallback } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const token = query.get('token')

    if (token) {
      handleAuthCallback(token)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [location, handleAuthCallback, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

export default AuthCallbackPage
