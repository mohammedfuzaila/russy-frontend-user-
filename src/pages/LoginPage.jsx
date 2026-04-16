import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      
      // Handle Admin Redirection
      if (res.data.user.is_staff) {
        toast.success(`Admin recognized! Redirecting to Portal... 🔐`)
        setTimeout(() => {
          // Point directly to frontend admin dashboard with token
          const adminUrl = 'https://russy-admin.netlify.app/login'
          window.location.href = `${adminUrl}?token=${res.data.token}`
        }, 1200)
        return
      }

      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}! 🌶️`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-cream to-orange-50">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo/logo-hen.png" 
            alt="Russy Masala" 
            className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md" 
          />
          <h1 className="font-display text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your Russy Masala account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 shadow-inner">
          <button 
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all bg-white text-spice-600 shadow-md scale-[1.02]"
          >
            User Login
          </button>
          <a 
            href={'https://russy-admin.netlify.app'}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all text-center text-gray-500 hover:text-gray-700 block"
          >
            Admin Login
          </a>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="input" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="input pr-12" required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-70">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-spice-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
