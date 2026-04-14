import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { addToWishlist } from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const SPICE_COLORS = ['from-orange-400 to-red-500', 'from-yellow-400 to-orange-500', 'from-red-500 to-rose-600', 'from-amber-400 to-yellow-600', 'from-orange-500 to-amber-600']

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { user } = useAuth()

  const colorClass = SPICE_COLORS[product.id % SPICE_COLORS.length]
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price)
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100)
    : 0

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Login to save to wishlist'); return }
    try {
      await addToWishlist(product.id)
      toast.success('Added to wishlist ❤️')
    } catch { toast.error('Failed to add to wishlist') }
  }

  return (
    <div className="glass-card group relative flex flex-col justify-between overflow-hidden animate-fade-in hover:-translate-y-2 h-full">
      {/* Image Section */}
      <Link to={`/products/${product.slug}`} className="block relative h-56 sm:h-64 overflow-hidden shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />
        
        {/* Spice Aura */}
        <div className={`spice-aura bg-gradient-to-r ${colorClass}`} />

        <div className="relative h-full w-full flex items-center justify-center p-8">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-contain drop-shadow-2xl translate-z-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out" 
            />
          ) : (
            <span className="text-8xl drop-shadow-2xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 cursor-default">🫙</span>
          )}
        </div>

        {/* Floating Actions */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
          <button
            onClick={(e) => { e.preventDefault(); addItem(product.id, 1); }}
            className="w-full glass-dark text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-spice-600 transition-colors shadow-xl"
          >
            <ShoppingCart size={18} />
            Quick Add
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-chili-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
              {discountPct}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-white/90 backdrop-blur text-spice-600 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Star size={10} className="fill-spice-600" /> Featured
            </span>
          )}
        </div>

        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2.5 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-chili-500"
        >
          <Heart size={18} className={user?.wishlist?.some(w => w.product_id === product.id) ? "fill-chili-500 text-chili-500" : ""} />
        </button>
      </Link>

      {/* Info Section - Glassmorphism */}
      <div className="p-6 pt-2 h-full flex flex-col">
        <div className="mb-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-spice-500/70">{product.category?.name || 'Spice'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-[10px] font-bold text-gray-400">{product.weight}</span>
          </div>
          
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-display text-xl font-bold text-gray-900 group-hover:text-spice-600 transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={i < Math.floor(product.rating) ? "fill-turmeric text-turmeric" : "text-gray-200"} 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] font-medium text-gray-400">({product.total_reviews} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs line-through text-gray-400 font-medium">₹{product.price}</span>
            )}
            <span className="text-2xl font-black text-gray-900 leading-none">₹{product.effective_price}</span>
          </div>
          
          <Link 
            to={`/products/${product.slug}`}
            className="p-3 bg-gray-50 hover:bg-spice-50 text-gray-400 hover:text-spice-600 rounded-xl transition-all duration-300"
          >
            <ChevronDown size={20} className="-rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  )
}
