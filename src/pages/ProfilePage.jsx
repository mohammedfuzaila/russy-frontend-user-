import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Package, Heart, Edit2, Save, X, ChevronRight } from 'lucide-react'
import { getProfile, updateProfile, getOrders, getWishlist, removeFromWishlist, cancelOrder } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    Promise.all([getProfile(), getOrders(), getWishlist()]).then(([p, o, w]) => {
      setProfile(p.data)
      setEditData(p.data)
      setOrders(o.data.orders)
      setWishlistItems(w.data.wishlist)
    }).finally(() => setLoading(false))
  }, [user, navigate])

  const handleSave = async () => {
    try {
      await updateProfile(editData)
      setProfile(editData)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
  }

  const handleRemoveWishlist = async (productId) => {
    await removeFromWishlist(productId)
    setWishlistItems((w) => w.filter((i) => i.product.id !== productId))
    toast.success('Removed from wishlist')
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully!');
      const o = await getOrders();
      setOrders(o.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel order');
    }
  }

  if (loading) return <div className="text-center py-32 text-gray-400">Loading...</div>

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="section-title mb-8">My <span className="gradient-text">Account</span></h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="card p-5 mb-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-spice-500 to-chili-600 rounded-full flex items-center justify-center text-white font-display text-2xl font-bold mx-auto mb-3">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <p className="font-semibold text-gray-900">{profile?.name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
          <div className="card p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-spice-50 text-spice-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
            <hr className="border-gray-100 my-1" />
            <button onClick={() => { logout(); navigate('/') }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-chili-600 hover:bg-chili-50 transition-colors">
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-900">Your Orders ({orders.length})</h2>
              {orders.length === 0 ? (
                <div className="card p-12 text-center">
                  <Package size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet. Start shopping!</p>
                  <Link to="/shop" className="btn-primary inline-flex">Shop Now</Link>
                </div>
              ) : orders.map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {order.payment_method && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{order.payment_method.replace('_', ' ')}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{order.status}</span>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹{order.total_amount}</p>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="mt-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors block ml-auto"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order tracking bar */}
                  {order.status !== 'cancelled' && (
                    <div className="flex items-center gap-1 mb-3">
                      {STATUS_STEPS.map((step, i) => {
                        const current = STATUS_STEPS.indexOf(order.status)
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i <= current ? 'bg-spice-500' : 'bg-gray-200'}`} />
                            {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < current ? 'bg-spice-500' : 'bg-gray-200'}`} />}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 space-y-1">
                    {order.items.slice(0, 2).map((item, i) => (
                      <p key={i}>{item.quantity}x {item.product_name}</p>
                    ))}
                    {order.items.length > 2 && <p className="text-xs text-gray-400">+ {order.items.length - 2} more items</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wishlist */}
          {tab === 'wishlist' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Wishlist ({wishlist.length})</h2>
              {wishlist.length === 0 ? (
                <div className="card p-12 text-center">
                  <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((w) => (
                    <div key={w.id} className="card p-4 flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-300 to-red-400 rounded-xl flex items-center justify-center text-2xl shrink-0">🫙</div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${w.product.slug}`} className="font-semibold text-gray-900 hover:text-spice-600 text-sm line-clamp-1">{w.product.name}</Link>
                        <p className="text-spice-600 font-bold text-sm">₹{w.product.effective_price}</p>
                      </div>
                      <button onClick={() => handleRemoveWishlist(w.product.id)} className="text-chili-400 hover:text-chili-600 shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Edit */}
          {tab === 'profile' && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900">Profile Details</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => { setEditing(false); setEditData(profile) }} className="btn-secondary text-sm py-2 px-4">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email', disabled: true },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                ].map(({ label, key, type, disabled }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                    <input type={type} value={editData[key] || ''} onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                      disabled={!editing || disabled} className={`input ${(!editing || disabled) ? 'bg-gray-50 text-gray-500' : ''}`} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select value={editData.gender || ''} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                    disabled={!editing} className={`input ${!editing ? 'bg-gray-50 text-gray-500 appearance-none' : ''}`}>
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Address</label>
                  <textarea value={editData.address || ''} onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    disabled={!editing} rows={3} className={`input resize-none ${!editing ? 'bg-gray-50 text-gray-500' : ''}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
