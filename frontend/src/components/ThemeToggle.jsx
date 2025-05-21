import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle animation state
  const handleClick = () => {
    setIsAnimating(true)
    toggleTheme()

    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 700)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative overflow-hidden rounded-full p-2
        bg-primary/10 hover:bg-primary/20
        transition-all duration-300
        ${isAnimating ? 'scale-110' : ''}
      `}
    >
      <div className="relative z-10">
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-300" />
        ) : (
          <Moon className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Animated background */}
      <div
        className={`
          absolute inset-0 transition-transform duration-700 ease-in-out
          ${isAnimating ? (isDark ? 'translate-y-full' : 'translate-y-[-100%]') : ''}
          ${isDark ? 'bg-gradient-to-br from-indigo-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
        `}
      />

      {/* Animated stars/sun rays */}
      {isDark && (
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1 left-1 h-1 w-1 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-3 right-2 h-1 w-1 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-3 h-1 w-1 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      )}
    </button>
  )
}

export default ThemeToggle
