import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (token) {
          // Configure axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Fetch current user
          const { data } = await axios.get('http://localhost:2000/api/auth/me')
          setUser(data)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Handle OAuth callback
  const handleAuthCallback = (token) => {
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Fetch user data
      fetchUserData()
    }
  }

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('http://localhost:2000/api/auth/me')
      setUser(data)
      setError(null)
    } catch (error) {
      console.error('Fetch user error:', error)
      setError('Failed to fetch user data')
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        handleAuthCallback,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
