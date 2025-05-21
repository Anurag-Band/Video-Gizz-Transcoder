import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import { Video, Sparkles } from 'lucide-react'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="border-b border-primary/10 transition-colors duration-300 sticky top-0 z-30 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <div className="relative">
                  <Video className="h-7 w-7 text-white" />
                  <Sparkles className="h-3 w-3 text-white absolute -top-1 -right-1" />
                </div>
                <span className="text-white">
                  Video Gizz
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary text-gray-900 dark:text-white"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-videos"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary text-gray-900 dark:text-white"
                  >
                    My Videos
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary text-gray-900 dark:text-white"
                  >
                    Upload
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="ring-2 ring-primary/20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block text-gray-900 dark:text-white">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="border-primary/20 hover:bg-primary/10 text-gray-900 dark:text-white"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    asChild
                    className="border-primary/20 hover:bg-primary/10 text-gray-900 dark:text-white"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

