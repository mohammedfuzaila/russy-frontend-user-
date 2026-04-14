import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { getOrder } from '../api'

export default function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    getOrder(id).then((r) => setOrder(r.data)).catch(() => {})
  }, [id])

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={44} className="text-green-600" />
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-6">Your order <span className="font-bold text-gray-800">#{id}</span> has been placed successfully. We'll pack it with love! 🌶️</p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Total Paid</span>
            <span className="font-bold text-gray-900 text-base">₹{order.total_amount}</span>
          </div>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.quantity}x {item.product_name}</span>
                <span className="font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="my-3 border-gray-100" />
          <p className="text-xs text-gray-500">Shipping to: {order.shipping_address}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/profile" className="btn-primary flex items-center gap-2 justify-center">
          <Package size={16} /> Track Order
        </Link>
        <Link to="/shop" className="btn-secondary flex items-center gap-2 justify-center">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
