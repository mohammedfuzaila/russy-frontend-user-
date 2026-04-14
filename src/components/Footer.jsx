import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 overflow-hidden">
                <img 
                  src="/logo/logo-hen.png" 
                  alt="Russy Masala" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white tracking-tighter block leading-none">Russy</span>
                <span className="font-display font-bold text-[10px] text-spice-400 tracking-[0.4em] uppercase block mt-1 leading-none">Premium Spices</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Bringing the soul of India's richest spice traditions to your kitchen since 2018. Every masala tells a story.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-spice-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/shop', 'Shop All Spices'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-spice-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {['Whole Spices', 'Ground Spices', 'Blended Masalas', 'Seeds & Grains', 'Exotic & Rare'].map((c) => (
                <li key={c}><Link to={`/shop?category=${c.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-spice-400 transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-spice-500 mt-1 shrink-0" />
                <div className="leading-relaxed">
                  <p className="font-bold text-white">Russy Masala</p>
                  <p className="text-gray-400">Pernambut, Vellore District,</p>
                  <p className="text-gray-400">Tamil Nadu, India</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={15} className="text-spice-500 shrink-0" />
                <span className="text-gray-400">Sat - Sun: 09:00 AM - 10:00 PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-spice-500 shrink-0" />
                <a href="tel:+918870539407" className="hover:text-spice-400 transition-colors">+91 88705 39407</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-spice-500 shrink-0" />
                <a href="mailto:russymasala@gmail.com" className="hover:text-spice-400 transition-colors">russymasala@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Russy Masala. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Managed and designed by</span>
            <a 
              href="https://fuzailscript.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-spice-400 transition-colors font-semibold"
            >
              Fuzail
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
