import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200)) // mock send
    toast.success('Message sent! We\'ll reply within 24 hours 📩')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-spice-600 to-chili-700 py-20 text-white text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Get in <span className="text-turmeric">Touch</span></h1>
        <p className="text-white/80 text-lg">We are always happy to hear from spice lovers!</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="section-title mb-4">Contact <span className="gradient-text">Info</span></h2>
              <p className="text-gray-500">Reach out to us for orders, wholesale inquiries, or simply to share your love of spices.</p>
            </div>

            {[
              { icon: MapPin, title: 'Our Office', content: 'Pernambut, Vellore District, Tamil Nadu, India' },
              { icon: Phone, title: 'Phone', content: '+91 88705 39407', href: 'tel:+918870539407' },
              { icon: Mail, title: 'Email', content: 'russymasala@gmail.com', href: 'mailto:russymasala@gmail.com' },
              { icon: Clock, title: 'Business Hours', content: 'Sat - Sun: 09:00 AM - 10:00 PM' },
            ].map(({ icon: Icon, title, content, href }) => (
              <div key={title} className="glass-card p-6 flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-spice-100 text-spice-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900 text-lg">{title}</p>
                  {href ? (
                    <a href={href} className="text-gray-600 text-sm mt-1 hover:text-spice-600 transition-colors">{content}</a>
                  ) : (
                    <p className="text-gray-600 text-sm mt-1">{content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="glass-card p-8 md:p-10">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Raju Sharma" className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com" className="input" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Order inquiry / Wholesale / Feedback" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4} placeholder="Tell us more..." className="input resize-none" required />
              </div>
              <button type="submit" disabled={sending}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                <Send size={16} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
