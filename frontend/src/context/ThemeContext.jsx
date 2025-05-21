import { createContext, useContext, useEffect, useState } from 'react'

// Create the theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
  toggleTheme: () => null,
  isDark: false,
})

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a saved theme preference or use system preference
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'

    try {
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme
      }

      // Check for system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch (err) {
      console.error('Error accessing localStorage:', err)
    }

    return 'light' // Default theme
  }

  const [theme, setTheme] = useState('light') // Initialize with default
  const [mounted, setMounted] = useState(false)
  const isDark = theme === 'dark'

  // Set theme only after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    setTheme(getInitialTheme())
  }, [])

  // Update theme in localStorage and apply to document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Remove previous theme class
    root.classList.remove('light', 'dark')

    // Add current theme class
    root.classList.add(theme)

    // Save theme to localStorage
    try {
      localStorage.setItem('theme', theme)
    } catch (err) {
      console.error('Error setting theme in localStorage:', err)
    }
  }, [theme, mounted])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Provide the theme context value
  const contextValue = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
