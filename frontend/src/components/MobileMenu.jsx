import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Home, User, Upload, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="relative z-50"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-900 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          border-l border-primary/10 shadow-xl
        `}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4">
          {/* User info if authenticated */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3 p-4 mb-6 bg-primary/10 rounded-lg">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Logged in</p>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-primary/10 transition-colors"
              onClick={closeMenu}
            >
              <Home className="h-5 w-5 text-primary" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-videos"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-primary/10 transition-colors"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 text-primary" />
                  <span>My Videos</span>
                </Link>
                <Link
                  to="/upload"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-primary/10 transition-colors"
                  onClick={closeMenu}
                >
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Upload</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-primary/10 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5 text-primary" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-3 px-4 py-3 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={closeMenu}
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* App info at bottom */}
          <div className="mt-auto pt-6 border-t border-primary/10">
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Video Gizz &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
