import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, Home, ShoppingBag, Info, Phone, ChevronRight, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinks = [
  { to: '/',        label: 'Home',    icon: Home },
  { to: '/shop',    label: 'Shop',    icon: ShoppingBag },
  { to: '/about',   label: 'About',   icon: Info },
  { to: '/contact', label: 'Contact', icon: Phone },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Handle body states when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }
    return () => { document.body.classList.remove('drawer-open') }
  }, [drawerOpen])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setDrawerOpen(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setDrawerOpen(false)
    }
  }

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <nav className="sticky top-0 z-50 glass bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Overlay */}
          {searchOpen && (
            <div className="absolute inset-0 z-50 flex items-center px-4 bg-white/96 backdrop-blur-xl border-b border-gray-100" style={{ height: '64px' }}>
              <form onSubmit={handleSearch} className="flex items-center w-full gap-3">
                <Search size={20} className="text-spice-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for spices, masalas..."
                  className="flex-1 bg-transparent outline-none text-gray-800 text-base font-medium placeholder-gray-400"
                />
                <button type="submit" className="btn-primary text-sm py-1.5 px-4 shrink-0">Go</button>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="p-2 text-gray-500 hover:text-spice-600 rounded-lg transition-colors shrink-0">
                  <X size={20} />
                </button>
              </form>
            </div>
          )}

          <div className="flex items-center justify-between h-16">
            {/* Logo — always shows Russy on all sizes */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative shrink-0">
                <img src="/logo/logo-hen.png" alt="Russy Masala"
                  className="h-9 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tighter gradient-text leading-none block">Russy</span>
                <span className="font-display font-bold text-[9px] uppercase tracking-[0.3em] text-gray-500 leading-none hidden sm:block">Premium Spices</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive ? 'bg-spice-50 text-spice-600' : 'text-gray-600 hover:text-spice-600 hover:bg-spice-50'
                    }`}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-spice-600 hover:bg-spice-50 rounded-lg transition-all" aria-label="Search">
                <Search size={20} />
              </button>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-spice-600 hover:bg-spice-50 rounded-lg transition-all">
                <ShoppingCart size={20} />
                {cart.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-chili-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.count}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden md:block">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-spice-50 hover:bg-spice-100 text-spice-700 rounded-lg transition-all text-sm font-medium">
                    <User size={16} />
                    <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
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
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/register" className="btn-secondary text-sm py-2 px-4 border-spice-200 text-spice-600">Register</Link>
                  <Link to="/login"    className="btn-primary text-sm py-2 px-4">Login</Link>
                </div>
              )}

              {/* Mobile hamburger — Morphing Model Design */}
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`burger-trigger md:hidden ${drawerOpen ? 'drawer-open' : ''}`}
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Full-screen Mobile Drawer ──────────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop — Subtle blur reveal */}
          <div
            className="mobile-drawer-backdrop fixed inset-0 z-[60] bg-black/5 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />

          {/* Drawer Panel — Glassmorphism & Slide */}
          <div className="mobile-drawer-panel fixed top-0 right-0 z-[70] h-full w-[85vw] max-w-[340px] flex flex-col border-l border-white/20"
            style={{ 
              background: 'rgba(255, 255, 255, 0.85)', 
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.1)' 
            }}>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-4 border-b border-gray-100/50">
              <Link to="/" onClick={closeDrawer} className="flex items-center gap-2">
                <img src="/logo/logo-hen.png" alt="Russy" className="h-8 w-auto" />
                <div>
                  <span className="font-display font-black text-lg gradient-text leading-none block">Russy</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Premium Spices</span>
                </div>
              </Link>
              <button 
                onClick={closeDrawer}
                className="p-2.5 rounded-full bg-gray-100/50 hover:bg-spice-50 text-gray-500 hover:text-spice-600 transition-all active:scale-90"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search inside drawer */}
            <div className="px-5 py-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search spices..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                {searchQuery && (
                  <button type="submit" className="text-spice-600 font-bold text-xs uppercase tracking-wider">Go</button>
                )}
              </form>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }, i) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={closeDrawer}
                  className="drawer-nav-item"
                  style={{ animationDelay: `${80 + i * 60}ms` }}>
                  {({ isActive }) => (
                    <div className={`drawer-link flex items-center gap-4 px-4 py-4 rounded-2xl ${isActive ? 'active bg-spice-50 text-spice-600' : 'text-gray-700'}`}>
                      <div className={`drawer-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-spice-100 text-spice-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={18} />
                      </div>
                      <span className="drawer-label font-semibold text-base flex-1">{label}</span>
                      <ChevronRight size={16} className="drawer-chevron text-spice-400 shrink-0" />
                    </div>
                  )}
                </NavLink>
              ))}

              {/* Cart & Wishlist shortcuts */}
              <div className="pt-3 border-t border-gray-100 mt-3 space-y-1">
                <Link to="/cart" onClick={closeDrawer}
                  className="drawer-nav-item drawer-link flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-700"
                  style={{ animationDelay: '360ms' }}>
                  <div className="drawer-icon w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    <ShoppingCart size={18} />
                  </div>
                  <span className="drawer-label font-semibold text-base flex-1">Cart</span>
                  {cart.count > 0 && (
                    <span className="bg-chili-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">{cart.count}</span>
                  )}
                  <ChevronRight size={16} className="drawer-chevron text-spice-400 shrink-0" />
                </Link>
              </div>
            </nav>

            {/* User section at bottom */}
            <div className="px-5 py-5 border-t border-gray-100 bg-gray-50/50"
              style={{ animationDelay: '420ms' }}>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-spice-400 to-chili-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={closeDrawer}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white transition-all text-sm font-medium">
                    <Package size={16} className="text-gray-400" /> My Orders
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-chili-600 hover:bg-chili-50 transition-all text-sm font-medium">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link to="/login" onClick={closeDrawer} className="btn-primary w-full text-center py-3 text-sm font-bold rounded-2xl">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeDrawer} className="btn-secondary w-full text-center py-3 text-sm font-bold rounded-2xl">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
