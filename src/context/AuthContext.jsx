import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('russy_token')
    if (token) {
      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('russy_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const login = (token, userData) => {
    localStorage.setItem('russy_token', token)
    setUser(userData)
    setShowLoginPrompt(false)
  }

  const logout = () => {
    localStorage.removeItem('russy_token')
    setUser(null)
  }

  const promptLogin = () => setShowLoginPrompt(true)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, promptLogin }}>
      {children}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-slide-up text-center">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
            >
              x
            </button>
            <div className="w-16 h-16 bg-spice-100 text-spice-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner text-2xl">
              🔒
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Please sign in to your account to continue and enhance your Premium Spices experience.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/login" className="btn-primary py-3.5 w-full block">Sign In</a>
              <a href="/register" className="btn-secondary py-3.5 w-full block">Create Account</a>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
