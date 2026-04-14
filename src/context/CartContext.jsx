import { createContext, useContext, useState, useEffect } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: '0', count: 0 })
  const [loading, setLoading] = useState(false)

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [], total: '0', count: 0 })
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await getCart()
      setCart(res.data)
    } catch (e) {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (product_id, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return }
    try {
      const res = await addToCart({ product_id, quantity })
      setCart(res.data.cart)
      toast.success('Added to cart! 🛒')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to add to cart')
    }
  }

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(itemId, { quantity })
      setCart(res.data.cart)
    } catch (e) {
      toast.error('Failed to update cart')
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await removeCartItem(itemId)
      setCart(res.data.cart)
      toast.success('Item removed')
    } catch (e) {
      toast.error('Failed to remove item')
    }
  }

  const clearAll = async () => {
    try {
      await clearCart()
      setCart({ items: [], total: '0', count: 0 })
    } catch (e) {
      // silent
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearAll, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
