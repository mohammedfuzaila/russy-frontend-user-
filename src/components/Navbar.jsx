import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, Heart, LogOut, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 glass bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo/logo-hen.png" 
                alt="Russy Masala" 
                className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute -inset-1 bg-spice-500/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-black text-2xl tracking-tighter gradient-text leading-none block">Russy</span>
              <span className="font-display font-bold text-[10px] uppercase tracking-[0.4em] text-gray-500 mt-0.5 leading-none block">Premium Spices</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive ? 'bg-spice-50 text-spice-600' : 'text-gray-600 hover:text-spice-600 hover:bg-spice-50'
                  }`
                }>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link to="/shop" className="p-2 text-gray-600 hover:text-spice-600 hover:bg-spice-50 rounded-lg transition-all">
              <Search size={20} />
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-spice-600 hover:bg-spice-50 rounded-lg transition-all">
              <ShoppingCart size={20} />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-chili-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cart.count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-spice-50 hover:bg-spice-100 text-spice-700 rounded-lg transition-all text-sm font-medium">
                  <User size={16} />
                  <span className="hidden sm:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-spice-50 hover:text-spice-600 transition-colors">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-spice-50 hover:text-spice-600 transition-colors">
                      <User size={15} /> Profile
                    </Link>
                    <hr className="border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-chili-600 hover:bg-chili-50 transition-colors">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href="https://russy-admin.netlify.app" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 px-4 hidden sm:inline-flex border-spice-200 text-spice-600">
                  Admin
                </a>
                <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
                  Login
                </Link>
              </div>
            )}


            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-spice-600 rounded-lg">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1 animate-slide-up">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive ? 'bg-spice-50 text-spice-600' : 'text-gray-600 hover:bg-spice-50 hover:text-spice-600'
                  }`
                }>
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="pt-4 flex flex-col gap-2 px-2">
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm py-3">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center text-sm py-3">Register</Link>
                </div>
                <a 
                  href="http://localhost:3001/login" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3 bg-gray-50 text-spice-600 font-bold text-center rounded-xl border border-spice-100 mt-2 hover:bg-spice-50 transition-colors"
                >
                  Go to Admin Panel
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
