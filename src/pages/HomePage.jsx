import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Leaf, Star } from 'lucide-react'
import { getProducts, getCategories } from '../api'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/Skeleton'

const HERO_SLIDES = [
  { emoji: '🌶️', title: 'Pure. Bold. Authentic.', subtitle: 'Handcrafted masalas from India\'s finest spice farms', gradient: 'from-orange-600 via-red-600 to-rose-700' },
  { emoji: '🫙', title: 'Blended with Love', subtitle: 'Over 20 secret blends perfected across generations', gradient: 'from-amber-600 via-orange-600 to-red-600' },
  { emoji: '🌿', title: '100% Natural Spices', subtitle: 'No preservatives, no additives — just pure flavour', gradient: 'from-yellow-600 via-amber-600 to-orange-600' },
]

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499', color: 'bg-orange-50 text-spice-600' },
  { icon: Shield, title: 'Quality Assured', desc: 'Lab-tested, FSSAI certified', color: 'bg-red-50 text-chili-600' },
  { icon: Leaf, title: '100% Natural', desc: 'No artificial additives', color: 'bg-green-50 text-green-700' },
  { icon: Star, title: '4.8★ Rated', desc: 'Loved by 50,000+ families', color: 'bg-yellow-50 text-turmeric' },
]

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    Promise.all([
      getProducts({ featured: 'true', page: 1 }),
      getCategories(),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.products.slice(0, 8))
      setCategories(cRes.data.categories)
    }).finally(() => setLoading(false))
  }, [])

  // Auto-advance hero slides
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = HERO_SLIDES[heroIdx]

  return (
    <div className="animate-fade-in overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} transition-all duration-1000 spice-dust min-h-[600px] md:min-h-[650px] flex items-center`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-20 w-[40%] h-[60%] bg-white/10 blur-[130px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-[50%] h-[70%] bg-black/10 blur-[150px] rounded-full" />
          
          <div className="absolute top-[15%] left-[5%] text-[100px] md:text-[180px] opacity-10 animate-float select-none filter blur-sm">🌶</div>
          <div className="absolute bottom-[10%] right-[10%] text-[80px] md:text-[140px] opacity-10 animate-float select-none filter blur-[2px]" style={{ animationDelay: '2s' }}>🫙</div>
          <div className="absolute top-[60%] left-[60%] text-[60px] md:text-[100px] opacity-5 animate-float select-none" style={{ animationDelay: '4s' }}>🌿</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
          <div className="flex-1 text-white text-center md:text-left z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 md:mb-8 border border-white/20 animate-fade-in shadow-xl mx-auto md:mx-0">
              <span className="w-2 h-2 bg-chili-400 rounded-full animate-ping" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/90 whitespace-nowrap">Curating India's Finest Traditions</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-7xl lg:text-9xl font-black leading-[0.9] md:leading-[0.85] mb-6 md:mb-8 animate-slide-up tracking-tighter">
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-2 md:mr-4 drop-shadow-2xl">{word}</span>
              ))}
            </h1>
            
            <p className="text-base md:text-2xl text-white/70 mb-10 md:mb-12 max-w-xl animate-slide-up leading-relaxed font-medium px-2 md:px-0 mx-auto md:mx-0">
              {slide.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 animate-slide-up px-2 md:px-0 w-full sm:w-auto">
              <Link to="/shop" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-spice-100 hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3">
                Experience the Aroma <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all flex items-center justify-center">
                Our Heritage
              </Link>
            </div>
          </div>

          {/* Large Visual Emoji for "WOW" */}
          <div className="flex-1 hidden md:flex justify-center items-center relative z-10">
             <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full animate-pulse-slow" />
             <div className="text-[250px] md:text-[350px] drop-shadow-[0_45px_45px_rgba(0,0,0,0.6)] animate-float select-none filter contrast-125 saturate-150">
                {slide.emoji}
             </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === heroIdx ? 'w-8 md:w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-3 bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-10 overflow-visible">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-3 md:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-4 hover:-translate-y-1 transition-transform duration-300 text-center sm:text-left h-full">
              <div className={`w-9 h-9 md:w-12 md:h-12 ${color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                <Icon size={isMobile ? 18 : 24} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-[10px] md:text-sm text-gray-900 truncate md:whitespace-normal">{title}</p>
                <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                className="glass-card p-4 md:p-5 group flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 border border-white/20">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-spice-50 text-xl md:text-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 drop-shadow-sm">
                  {cat.icon || '🌶️'}
                </div>
                <div>
                  <p className="font-display font-bold text-[10px] md:text-sm text-gray-900 uppercase tracking-widest">{cat.name}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase mt-0.5 group-hover:text-spice-600 transition-colors hidden sm:block">Explore Collection</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── OUR STORY ─────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-spice-50/50 -skew-x-12 transform origin-top translate-x-20 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 relative w-full">
                <div className="relative z-10 rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-white group">
                    <img 
                        src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000" 
                        alt="Authentic Spices" 
                        className="w-full h-[300px] md:h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-10">
                        <p className="text-white font-display text-xl md:text-2xl font-bold leading-tight">Harvesting Traditions, <br/>Spreading Flavours.</p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-5 -left-5 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-turmeric/20 rounded-full blur-2xl md:blur-3xl animate-pulse" />
                <div className="absolute -bottom-5 -right-5 md:-bottom-10 md:-right-10 w-32 h-32 md:w-60 md:h-60 bg-chili-600/10 rounded-full blur-2xl md:blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 -right-6 md:-right-12 w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-xl flex items-center justify-center text-2xl md:text-4xl rotate-12 animate-float">🌶️</div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-spice-100 text-spice-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Our Heritage
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 md:mb-8 tracking-tighter">
                The Secret Behind Every <span className="gradient-text">Delicious Meal</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-medium">
                At Russy Masala, we believe that great cooking starts with the soul of the ingredients. Since 2018, we have been scouting the most fertile spice gardens across India to bring you flavours that are pure, potent, and perfectly balanced.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10 text-left">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-spice-600 shrink-0">
                        <Leaf size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Farm to Jar</h4>
                        <p className="text-xs md:text-sm text-gray-500">Directly sourced from local farmers to ensure maximum freshness.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-chili-600 shrink-0">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Zero Additives</h4>
                        <p className="text-xs md:text-sm text-gray-500">No preservatives or artificial colours. Just 100% natural goodness.</p>
                    </div>
                </div>
              </div>

              <Link to="/about" className="inline-flex items-center gap-3 font-black text-sm uppercase tracking-widest text-spice-600 hover:text-spice-700 transition-colors group">
                Read Our Full Story <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US / STATS ────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-900 relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="font-display text-2xl md:text-5xl font-bold text-white mb-4 italic">Crafted for Excellence</h2>
                <p className="text-sm md:text-gray-400 max-w-2xl mx-auto px-4">From the finest turmeric to exotic blended masalas, every product is a testament to our quality commitment.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                <div>
                    <p className="font-display text-4xl md:text-5xl font-black text-spice-400 mb-2">50k+</p>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Happy Families</p>
                </div>
                <div>
                    <p className="font-display text-4xl md:text-5xl font-black text-chili-400 mb-2">100%</p>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Pure & Natural</p>
                </div>
                <div>
                    <p className="font-display text-4xl md:text-5xl font-black text-turmeric mb-2">20+</p>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Spice Blends</p>
                </div>
                <div>
                    <p className="font-display text-4xl md:text-5xl font-black text-orange-400 mb-2">4.9★</p>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Average Rating</p>
                </div>
            </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured <span className="gradient-text">Spices</span></h2>
            <p className="text-gray-500 mt-1">Our most-loved picks, straight from the source</p>
          </div>
          <Link to="/shop" className="btn-secondary text-sm py-2 px-4 hidden sm:flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── BANNER CTA ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-spice-600 to-chili-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">🌶️ Use Code <span className="text-turmeric">RUSSY10</span> for 10% Off!</h2>
          <p className="text-white/80 mb-8">Your first order, made more delicious. Limited time offer.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-spice-600 font-bold px-8 py-3.5 rounded-xl hover:bg-spice-50 transition-all shadow-lg">
            Shop Now & Save <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
