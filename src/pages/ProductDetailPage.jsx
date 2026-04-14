import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft, Package } from 'lucide-react'
import { getProduct, addReview, addToWishlist } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SPICE_COLORS = ['from-orange-400 to-red-500', 'from-yellow-400 to-orange-500', 'from-red-500 to-rose-600', 'from-amber-400 to-yellow-600', 'from-orange-500 to-amber-600']

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    setLoading(true)
    getProduct(slug).then((r) => setProduct(r.data)).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => { addItem(product.id, qty) }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return }
    try { await addToWishlist(product.id); toast.success('Added to wishlist ❤️') }
    catch { toast.error('Failed') }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    setSubmittingReview(true)
    try {
      await addReview(slug, { rating: reviewRating, comment: reviewText })
      toast.success('Review submitted! ⭐')
      setReviewText('')
      setReviewRating(5)
      const r = await getProduct(slug)
      setProduct(r.data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    } finally { setSubmittingReview(false) }
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="skeleton rounded-3xl h-96" />
        <div className="space-y-4">
          {[3, 6, 4, 8, 2].map((w, i) => <div key={i} className={`skeleton h-5 w-${w}/12 rounded`} />)}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-32">
      <p className="text-6xl mb-4">😔</p>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  )

  const colorClass = SPICE_COLORS[product.id % SPICE_COLORS.length]
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price)
  const discountPct = hasDiscount ? Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-spice-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chili-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-12 relative z-10">
        <Link to="/" className="hover:text-spice-600 transition-colors">Home</Link>
        <span className="opacity-30">/</span>
        <Link to="/shop" className="hover:text-spice-600 transition-colors">Shop</Link>
        <span className="opacity-30">/</span>
        <span className="text-spice-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-16 mb-24 relative z-10">
        {/* Image Section */}
        <div className={`glass-card bg-gradient-to-br ${colorClass} p-12 flex items-center justify-center relative overflow-hidden min-h-[450px] group shadow-2xl shadow-spice-900/10`}>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="spice-aura bg-white/20 blur-[120px]" />
          
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out" />
          ) : (
            <span className="text-[200px] drop-shadow-3xl transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 select-none">🫙</span>
          )}
          
          {hasDiscount && (
            <span className="absolute top-6 left-6 bg-chili-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-wider animate-bounce">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-spice-100 text-spice-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              {product.category?.name}
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="px-4 py-1.5 bg-chili-100 text-chili-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-chili-600 rounded-full animate-ping" /> Only {product.stock} Left!
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 bg-turmeric/10 px-3 py-1.5 rounded-xl">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} className={s <= Math.round(parseFloat(product.rating)) ? 'fill-turmeric text-turmeric' : 'text-gray-300'} />
              ))}
              <span className="ml-2 text-sm font-black text-turmeric-700">{product.rating}</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Across {product.total_reviews} verified reviews
            </span>
          </div>

          <div className="flex items-end gap-5 mb-10">
            <span className="font-display text-5xl font-black text-gray-900 tracking-tighter">₹{product.effective_price}</span>
            {hasDiscount && <span className="text-2xl line-through text-gray-300 font-bold mb-1">₹{product.price}</span>}
            <div className="mb-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Net {product.weight}
            </div>
          </div>

          {/* Qty & Action */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
            <div className="flex items-center glass bg-white/50 rounded-2xl overflow-hidden shadow-sm border-none p-1 shrink-0">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 text-gray-600 hover:bg-white rounded-xl transition-all active:scale-95"><Minus size={18} /></button>
              <span className="px-8 font-display font-black text-xl text-gray-900 border-none min-w-[60px] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-4 text-gray-600 hover:bg-white rounded-xl transition-all active:scale-95"><Plus size={18} /></button>
            </div>
            
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-3 py-5 text-lg shadow-2xl shadow-spice-200 disabled:opacity-50">
              <ShoppingCart size={22} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Collection'}
            </button>
            
            <button onClick={handleWishlist} className="glass-card p-5 text-gray-400 hover:text-chili-600 hover:shadow-chili-100/50 transition-all">
              <Heart size={24} />
            </button>
          </div>

          <div className="glass-card p-6 bg-white/40 border-white/20 flex items-start gap-4">
            <div className="w-10 h-10 bg-spice-100 text-spice-600 rounded-xl flex items-center justify-center shrink-0">
               <Package size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">Authenticity Guaranteed</p>
              <p className="text-xs text-gray-500 mt-1">100% natural spices sourced directly from local farmers in Karnataka & Kerala.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-24 relative z-10">
        <div className="flex gap-10 border-b border-gray-100/50 mb-12">
          {['description', 'reviews'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-4 font-display font-bold text-lg capitalize transition-all relative ${
                activeTab === tab ? 'text-spice-600' : 'text-gray-400 hover:text-gray-900'
              }`}>
              {tab} {tab === 'reviews' && <span className="ml-1 opacity-50 text-sm">({product.reviews?.length || 0})</span>}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-spice-500 rounded-full animate-slide-right" />}
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          {activeTab === 'description' && (
            <div className="prose prose-lg prose-spice text-gray-600 leading-relaxed animate-fade-in font-medium">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-spice-600 first-letter:mr-3 first-letter:float-left">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-8">
              {product.reviews?.length === 0 && (
                <div className="glass-card py-20 text-center opacity-60">
                   <Star size={48} className="mx-auto mb-4 text-gray-200" />
                   <p className="font-bold text-gray-400">Be the first to share your experience</p>
                </div>
              )}
              
              <div className="grid gap-6">
                {product.reviews?.map((r, i) => (
                  <div key={r.id} className="glass-card p-8 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-spice-100 text-spice-600 rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
                          {r.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-display font-bold text-gray-900 leading-none">{r.user}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Buyer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-turmeric/5 rounded-lg border border-turmeric/10">
                        <Star size={12} className="fill-turmeric text-turmeric" />
                        <span className="text-sm font-black text-turmeric-700">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                    <div className="mt-6 pt-6 border-t border-gray-50 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                       {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              {user && (
                <form onSubmit={handleReview} className="glass-card p-10 mt-12 bg-gray-900 text-white border-none shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-spice-500/10 blur-[60px] group-hover:blur-[80px] transition-all" />
                  <h3 className="font-display text-2xl font-bold mb-2">Leave a Impression</h3>
                  <p className="text-gray-400 text-sm mb-8">Your feedback helps fellow spice enthusiasts make better choices.</p>
                  
                  <div className="flex gap-3 mb-8">
                    {[1,2,3,4,5].map((s) => (
                      <button type="button" key={s} onClick={() => setReviewRating(s)} className="transition-all transform active:scale-95">
                        <Star size={32} className={`${s <= reviewRating ? 'fill-turmeric text-turmeric' : 'text-gray-700 fill-gray-800'} transition-all`} />
                      </button>
                    ))}
                  </div>

                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the aroma, flavor, and profile..." rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spice-500 transition-all resize-none mb-6" required />
                  
                  <button type="submit" disabled={submittingReview} 
                    className="btn-primary bg-white text-gray-900 hover:bg-spice-100 px-10 py-4 font-black uppercase tracking-widest text-xs border-none shadow-none">
                    {submittingReview ? 'Dispatching...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
