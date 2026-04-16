import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Tag, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder, validateCoupon } from '../api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, clearAll } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState(user?.address || '')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [upiId, setUpiId] = useState('')
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [placing, setPlacing] = useState(false)

  const subtotal = parseFloat(cart.total) || 0
  const delivery = subtotal >= 499 ? 0 : 49
  const discountAmt = discount ? parseFloat(discount.discount_amount) : 0
  const finalTotal = Math.max(0, subtotal + delivery - discountAmt)

  if (!user) return (
    <div className="text-center py-32">
      <Link to="/login" className="btn-primary">Login to Checkout</Link>
    </div>
  )

  if (cart.items.length === 0) return (
    <div className="text-center py-32">
      <p className="text-gray-600 mb-4">Your cart is empty</p>
      <Link to="/shop" className="btn-primary">Shop Now</Link>
    </div>
  )

  const handleValidateCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await validateCoupon({ coupon_code: coupon.trim().toUpperCase(), total: subtotal + delivery })
      setDiscount(res.data)
      toast.success(`Coupon applied! You save ₹${res.data.discount_amount} 🎉`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid coupon')
      setDiscount(null)
    } finally { setCouponLoading(false) }
  }

  const handleMockPayment = async () => {
    if (!address.trim()) { toast.error('Please enter your shipping address'); return }
    
    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter your UPI ID'); return;
    }
    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (!cardDetails.number.trim() || !cardDetails.expiry.trim() || !cardDetails.cvv.trim() || !cardDetails.name.trim())) {
      toast.error('Please fill in all card details'); return;
    }

    setPlacing(true)
    // Mock Razorpay — simulate payment success
    await new Promise((r) => setTimeout(r, 1500))
    const mockPaymentId = `PAY_${Date.now()}_MOCK`
    try {
      const res = await placeOrder({
        shipping_address: address,
        payment_method: paymentMethod,
        payment_id: paymentMethod !== 'cod' ? `PAY_${Date.now()}_MOCK` : '',
        coupon_code: coupon.trim().toUpperCase(),
      })
      clearAll()
      toast.success('Order placed successfully! 🎉')
      navigate(`/order-success/${res.data.order_id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order')
    } finally { setPlacing(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-spice-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-chili-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <h1 className="section-title mb-12">Secure <span className="gradient-text tracking-tight">Checkout</span></h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: address + coupon */}
        <div className="flex-1 space-y-8">

          {/* Delivery Address */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-spice-100 text-spice-600 rounded-xl flex items-center justify-center shadow-inner">📦</div>
              Delivery Address
            </h2>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4}
              placeholder="Enter your full shipping address including pincode..." className="input resize-none bg-white/50 border-none focus:ring-2 focus:ring-spice-200" />
          </div>

          {/* Payment Method */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-spice-100 text-spice-600 rounded-xl flex items-center justify-center shadow-inner"><CreditCard size={20} /></div>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'upi', label: 'UPI / QR Code', icon: '📱' },
                { id: 'credit_card', label: 'Credit Card', icon: '💳' },
                { id: 'debit_card', label: 'Debit Card', icon: '🏧' },
                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === pm.id ? 'border-spice-500 bg-spice-50 shadow-md transform scale-[1.02]' : 'border-transparent bg-white/50 hover:bg-white hover:border-spice-200'}`}
                >
                  <span className="text-2xl">{pm.icon}</span>
                  <span className="font-bold text-gray-900">{pm.label}</span>
                </button>
              ))}
            </div>
            
            {/* Conditional Input block based on payment method */}
            {paymentMethod === 'upi' && (
              <div className="mt-6 p-5 bg-white/60 backdrop-blur rounded-2xl border border-spice-100 animate-slide-up shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Enter UPI ID</label>
                <div className="flex gap-2">
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="username@upi" className="input bg-white w-full shadow-sm" />
                  <button type="button" className="btn-secondary px-6 text-sm whitespace-nowrap">Verify</button>
                </div>
              </div>
            )}
            
            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <div className="mt-6 p-6 bg-white/60 backdrop-blur rounded-2xl border border-spice-100 space-y-5 animate-slide-up shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[100px] opacity-5">💳</div>
                <div className="relative z-10">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                  <input type="text" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} placeholder="0000 0000 0000 0000" className="input bg-white w-full tracking-widest shadow-sm font-mono text-lg py-3" />
                </div>
                <div className="grid grid-cols-2 gap-5 relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                    <input type="text" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} placeholder="MM/YY" className="input bg-white w-full tracking-widest text-center shadow-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                    <input type="password" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} placeholder="•••" className="input bg-white w-full text-center shadow-sm tracking-widest font-mono" />
                  </div>
                </div>
                <div className="relative z-10">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cardholder Name</label>
                  <input type="text" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} placeholder="Name exactly as on card" className="input bg-white w-full shadow-sm" />
                </div>
              </div>
            )}
            
            {paymentMethod === 'cod' && (
              <div className="mt-6 p-5 bg-green-50/80 backdrop-blur rounded-2xl border border-green-200 text-green-800 text-sm font-bold flex flex-col gap-2 animate-slide-up shadow-sm">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle size={20} className="text-green-600" /> Pay on delivery.
                </div>
                <span className="text-green-600/80 font-medium">Please keep exact change ready to avoid inconvenience.</span>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-spice-100 text-spice-600 rounded-xl flex items-center justify-center shadow-inner"><Tag size={20} /></div>
              Special Offer
            </h2>
            <div className="flex gap-3">
              <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="e.g. RUSSY10" className="input flex-1 bg-white/50 border-none focus:ring-2 focus:ring-spice-200 font-bold uppercase tracking-widest" />
              <button onClick={handleValidateCoupon} disabled={couponLoading}
                className="btn-secondary px-8 whitespace-nowrap border-none bg-spice-50 hover:bg-spice-100 text-spice-700 font-bold">
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
            {discount && (
              <div className="mt-4 flex items-center gap-3 text-green-700 bg-green-50/50 backdrop-blur border border-green-100 px-5 py-3 rounded-2xl animate-slide-up">
                <CheckCircle size={20} />
                <span className="text-sm font-bold tracking-tight">Coupon applied! You saved ₹{discount.discount_amount}</span>
              </div>
            )}
            <div className="flex gap-2 flex-wrap mt-4">
               {['RUSSY10', 'SPICE20', 'WELCOME15'].map(c => (
                 <button key={c} onClick={() => setCoupon(c)} className="text-[10px] font-black tracking-widest text-gray-400 hover:text-spice-600 bg-gray-100/50 hover:bg-spice-50 px-2 py-1 rounded-md transition-all">{c}</button>
               ))}
            </div>
          </div>

          {/* Cart Items preview */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <div className="w-10 h-10 bg-spice-100 text-spice-600 rounded-xl flex items-center justify-center shadow-inner">🛒</div>
               Review Items ({cart.count})
            </h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 p-3 hover:bg-white/30 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                       {item.image ? <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" /> : '🫙'}
                    </div>
                    <div>
                      <p className="font-display font-bold text-gray-900 line-clamp-1">{item.product_name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-display font-black text-gray-900">₹{item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary + pay */}
        <div className="lg:w-96 shrink-0">
          <div className="glass-card p-10 sticky top-28 shadow-2xl border-white/60">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-base text-gray-600 font-medium tracking-tight">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600 font-medium tracking-tight">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-bold' : 'font-bold text-gray-900'}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-600 font-bold tracking-tight animate-slide-up">
                   <span>Discount</span>
                   <span>- ₹{discountAmt.toFixed(2)}</span>
                </div>
              )}
              
              <div className="pt-8 border-t border-gray-100 mt-8 overflow-hidden">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-1">Total Payable</p>
                    <p className="font-display font-black text-4xl text-gray-900 leading-none tracking-tight">
                       ₹{finalTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleMockPayment} disabled={placing}
              className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-xl shadow-xl shadow-spice-200">
              <CreditCard size={24} />
              {placing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>

            <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
            </div>
            <p className="text-center text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-6">
              🔒 Encrypted 256-bit Secure Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
