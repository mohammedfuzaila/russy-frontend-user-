import axios from 'axios'

const api = axios.create({
  baseURL: 'https://russyprojectbackend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('russy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser = (data) => api.post('/register/', data)
export const loginUser = (data) => api.post('/login/', data)
export const getProfile = () => api.get('/profile/')
export const updateProfile = (data) => api.put('/profile/', data)

// Products
export const getProducts = (params) => api.get('/products/', { params })
export const getProduct = (slug) => api.get(`/products/${slug}/`)
export const addReview = (slug, data) => api.post(`/products/${slug}/review/`, data)

// Categories
export const getCategories = () => api.get('/categories/')

// Cart
export const getCart = () => api.get('/cart/')
export const addToCart = (data) => api.post('/cart/add/', data)
export const updateCartItem = (itemId, data) => api.put(`/cart/update/${itemId}/`, data)
export const removeCartItem = (itemId) => api.delete(`/cart/update/${itemId}/`)
export const clearCart = () => api.delete('/cart/clear/')

// Orders
export const getOrders = () => api.get('/orders/')
export const getOrder = (id) => api.get(`/orders/${id}/`)
export const placeOrder = (data) => api.post('/orders/', data)

// Wishlist
export const getWishlist = () => api.get('/wishlist/')
export const addToWishlist = (product_id) => api.post('/wishlist/', { product_id })
export const removeFromWishlist = (product_id) => api.delete('/wishlist/', { data: { product_id } })

// Coupons
export const validateCoupon = (data) => api.post('/validate-coupon/', data)

export default api
