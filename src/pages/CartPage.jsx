import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart()
  const { user } = useAuth()

  if (!user) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Please login to view your cart</h2>
      <Link to="/login" className="btn-primary inline-flex">Login Now</Link>
    </div>
  )

  if (cart.items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center animate-fade-in">
      <ShoppingBag size={72} className="text-gray-200 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some delicious spices to get started!</p>
      <Link to="/shop" className="btn-primary inline-flex items-center gap-2">Browse Spices <ArrowRight size={16} /></Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-spice-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chili-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <h1 className="section-title mb-12">Your <span className="gradient-text tracking-tight">Cart</span></h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart items */}
        <div className="flex-1 space-y-6">
          {cart.items.map((item, idx) => (
            <div key={item.id} className="glass-card p-6 flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* Image */}
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:rotate-3 transition-transform">
                {item.image ? (
                  <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🫙</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_slug}`} className="font-display font-bold text-xl text-gray-900 hover:text-spice-600 transition-colors line-clamp-1">
                  {item.product_name}
                </Link>
                <p className="text-spice-600 font-bold text-base mt-1">₹{item.price}</p>
                <div className="mt-4 flex items-center gap-4 sm:hidden">
                   <div className="flex items-center glass bg-white/50 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-white transition-colors"><Minus size={14} /></button>
                    <span className="px-3 py-2 font-bold text-gray-800 border-x border-gray-100/50 text-sm">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-white transition-colors"><Plus size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Qty controls Desktop */}
              <div className="hidden sm:flex items-center glass bg-white/50 rounded-2xl overflow-hidden shadow-sm shrink-0">
                <button onClick={() => updateItem(item.id, item.quantity - 1)}
                  className="px-4 py-3 text-gray-600 hover:bg-white transition-colors active:bg-gray-100"><Minus size={16} /></button>
                <span className="px-6 py-3 font-bold text-gray-800 border-x border-gray-100/50 text-base">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}
                  className="px-4 py-3 text-gray-600 hover:bg-white transition-colors active:bg-gray-100"><Plus size={16} /></button>
              </div>

              <div className="text-right shrink-0">
                <p className="font-display font-black text-xl text-gray-900">₹{item.subtotal}</p>
                <button onClick={() => removeItem(item.id)} className="text-chili-400 hover:text-chili-600 mt-2 p-2 rounded-lg hover:bg-chili-50 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="glass-card p-8 sticky top-28 shadow-2xl border-white/60">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-base text-gray-600 font-medium tracking-tight">
                <span>Subtotal ({cart.count} items)</span>
                <span className="font-bold text-gray-900">₹{cart.total}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600 font-medium tracking-tight">
                <span>Delivery</span>
                <span className={parseFloat(cart.total) >= 499 ? 'text-green-600 font-bold' : 'font-bold text-gray-900'}>
                  {parseFloat(cart.total) >= 499 ? '🔥 FREE' : '₹49'}
                </span>
              </div>
              
              {parseFloat(cart.total) < 499 && (
                <div className="p-4 bg-spice-50 text-spice-700 rounded-2xl border border-spice-100 shadow-inner">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Goal for Free Delivery</p>
                  <p className="text-sm font-semibold">
                    Add ₹{(499 - parseFloat(cart.total)).toFixed(2)} more to unlock!
                  </p>
                  <div className="w-full h-1.5 bg-white/60 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-spice-500 transition-all duration-1000" style={{ width: `${(parseFloat(cart.total) / 499) * 100}%` }} />
                  </div>
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-100 mt-6 overflow-hidden">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-1">Total Amount</p>
                    <p className="font-display font-black text-3xl text-gray-900 leading-none tracking-tight">
                      ₹{(parseFloat(cart.total) + (parseFloat(cart.total) >= 499 ? 0 : 49)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-lg shadow-xl shadow-spice-200">
              Checkout Now <ArrowRight size={20} />
            </Link>
            <Link to="/shop" className="block text-center text-sm font-bold text-spice-500 hover:text-spice-700 mt-6 transition-colors uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
