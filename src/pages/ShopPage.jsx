import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { getProducts, getCategories } from '../api'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/Skeleton'

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => { getCategories().then((r) => setCategories(r.data.categories)) }, [])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    getProducts({ search, category, page })
      .then((r) => {
        setProducts(r.data.products)
        setTotalPages(r.data.pages)
        setTotalCount(r.data.total)
      })
      .finally(() => setLoading(false))
  }, [search, category, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val); else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const applySearch = (e) => { e.preventDefault(); setParam('search', searchInput) }

  const clearAll = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const hasFilters = search || category

  return (
    <div className="min-h-screen bg-cream grain pb-20">
      {/* Immersive Header */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="spice-aura bg-spice-500/20 top-[-20%] left-[-10%]" />
        <div className="spice-aura bg-chili-600/10 bottom-[-20%] right-[-10%]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tight">
            Our <span className="gradient-text">Signature</span> Collection
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            From the sun-drenched fields of Malabar to the misty hills of Munnar, 
            discover the world's most authentic spices.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pulse Strip */}
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory px-2">
          <button 
            onClick={() => setParam('category', '')}
            className={`snap-start shrink-0 h-16 min-w-[160px] px-6 rounded-2xl flex items-center gap-4 transition-all duration-500 shadow-sm border border-white/20 ${!category ? 'glass-dark text-white scale-105 shadow-xl ring-2 ring-spice-500/20' : 'glass text-gray-700 hover:scale-[1.02] hover:bg-white hover:shadow-md'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${!category ? 'bg-white/20' : 'bg-spice-50'}`}>🌿</div>
            <span className="font-display font-bold text-xs uppercase tracking-[0.1em] whitespace-nowrap">All Spices</span>
          </button>
          
          {categories.map((c, i) => (
            <button 
              key={c.id} 
              onClick={() => setParam('category', c.slug)}
              className={`snap-start shrink-0 h-16 min-w-[180px] px-6 rounded-2xl flex items-center gap-4 transition-all duration-500 shadow-sm border border-white/20 ${category === c.slug ? 'glass-dark text-white scale-105 shadow-xl ring-2 ring-spice-500/20' : 'glass text-gray-700 hover:scale-[1.02] hover:bg-white hover:shadow-md'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${category === c.slug ? 'bg-white/20' : 'bg-spice-50'}`}>
                {c.icon || '🌶️'}
              </div>
              <span className="font-display font-bold text-xs uppercase tracking-[0.1em] whitespace-nowrap">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Floating Command Center */}
        <div className="sticky top-6 z-40 mb-12">
          <div className="glass p-3 rounded-3xl flex flex-col md:flex-row gap-3 shadow-2xl border-white/40">
            <form onSubmit={applySearch} className="flex-1 relative">
              <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-spice-500" />
              <input 
                type="text" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Find your flavor..." 
                className="w-full bg-white/50 border-none rounded-2xl py-4 pl-14 pr-4 font-semibold text-gray-900 placeholder-gray-400 focus:ring-0" 
              />
            </form>
            
            <div className="flex gap-3">

              <select 
                className="glass bg-white/30 border-none rounded-2xl px-6 font-bold text-sm text-gray-700 focus:ring-0 cursor-pointer"
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4 ml-6">
              {search && <FilterChip label={`Search: ${search}`} onRemove={() => { setSearchInput(''); setParam('search', '') }} />}
              {category && <FilterChip label={`Category: ${category}`} onRemove={() => setParam('category', '')} />}
              <button 
                onClick={clearAll} 
                className="text-[10px] uppercase font-black tracking-widest text-chili-600 hover:text-chili-700 bg-chili-50 px-3 py-2 rounded-full"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="glass rounded-[3rem] py-32 text-center">
              <span className="text-8xl mb-8 block">🏜️</span>
              <h3 className="font-display text-3xl font-black text-gray-900 mb-2">The Pantry is Empty</h3>
              <p className="text-gray-500 font-medium mb-10">We couldn't find any spices matching your search.</p>
              <button onClick={clearAll} className="btn-primary py-4 px-10 rounded-2xl">Return to Full Market</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-20">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p} 
                  onClick={() => setParam('page', p)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all duration-300 ${
                    p === page ? 'glass-dark text-white shadow-xl scale-110' : 'glass text-gray-600 hover:bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 badge-orange text-sm py-1.5">
      {label}
      <button onClick={onRemove}><X size={12} /></button>
    </span>
  )
}

function FilterPanel({ categories, selectedCategory, setCategory, priceMin, priceMax, setPriceMin, setPriceMax, applyPrice, clearAll, hasFilters }) {
  return (
    <div className="space-y-6">
      {hasFilters && (
        <button onClick={clearAll} className="text-sm text-chili-600 hover:underline font-medium">Clear all filters</button>
      )}

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">Category <ChevronDown size={15} /></h3>
        <div className="space-y-1.5">
          <button onClick={() => setCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-spice-100 text-spice-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            All Categories
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === c.slug ? 'bg-spice-100 text-spice-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min ₹" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
            className="input text-sm py-2 px-3" />
          <span className="text-gray-400">–</span>
          <input type="number" placeholder="Max ₹" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
            className="input text-sm py-2 px-3" />
        </div>
        <button onClick={applyPrice} className="btn-primary w-full mt-3 text-sm py-2">Apply</button>
      </div>
    </div>
  )
}
