import { Leaf, Award, Users, Heart } from 'lucide-react'

const TEAM = [
  { name: 'Anaikar Md Haneef', role: 'Founder', photo: 'https://ui-avatars.com/api/?name=Anaikar+Md+Haneef&background=E85D04&color=fff&size=256' },
  { name: 'Anaikar Faiyaz Ahmed', role: 'Co-Founder', photo: 'https://ui-avatars.com/api/?name=Anaikar+Faiyaz+Ahmed&background=DC2626&color=fff&size=256' },
  { name: 'Anaikar Md Fuzail', role: 'Managing Director', photo: 'https://ui-avatars.com/api/?name=Anaikar+Md+Fuzail&background=F59E0B&color=fff&size=256' },
]

const STATS = [
  { value: '50,000+', label: 'Happy Families' },
  { value: '18+', label: 'Premium Blends' },
  { value: '8', label: 'Years of Trust' },
  { value: '4.8★', label: 'Average Rating' },
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in relative">
      {/* Hero */}
      <div className="bg-gradient-to-br from-spice-600 to-chili-800 py-28 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Our <span className="text-turmeric drop-shadow-md">Journey</span></h1>
          <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl font-medium px-4 leading-relaxed">
            Russy Masala was born from a deep-rooted passion for authentic culinary traditions — where spices weren't just ingredients, they were the soul of every meal.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title mb-6">Built on <span className="gradient-text">Trust</span></h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Founded by Anaikar Md Haneef and Anaikar Faiyaz Ahmed, and driven forward by Managing Director Anaikar Md Fuzail, Russy Masala represents a strict commitment to unrivaled quality and heritage. 
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, Russy Masala works directly with the finest growers across India, ensuring that every batch is stone-ground, sun-dried, and rigorously tested. We honor the timeless traditions of spice blending, bringing world-class, premium masalas straight to your kitchen.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-spice-500 to-chili-600 rounded-[2.5rem] h-80 flex items-center justify-center text-[140px] shadow-2xl transform hover:rotate-3 transition-transform duration-500">
            🌿
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass-card p-8 text-center group hover:-translate-y-2">
              <p className="font-display text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">{value}</p>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="section-title text-center mb-12">Our <span className="gradient-text">Values</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: '100% Natural', desc: 'No artificial colours, flavours or preservatives. Ever.', col: 'bg-green-100 text-green-600 shadow-green-100/50' },
              { icon: Award, title: 'FSSAI Certified', desc: 'Rigorously tested in accredited labs for safety and purity.', col: 'bg-blue-100 text-blue-600 shadow-blue-100/50' },
              { icon: Users, title: 'Ethical Sourcing', desc: 'Fair trade partnerships supporting local agricultural communities.', col: 'bg-orange-100 text-spice-600 shadow-orange-100/50' },
              { icon: Heart, title: 'Made with Love', desc: 'Every blend perfected through generations of culinary heritage.', col: 'bg-red-100 text-chili-600 shadow-red-100/50' },
            ].map(({ icon: Icon, title, desc, col }) => (
              <div key={title} className="glass-card p-8 text-center group">
                <div className={`w-16 h-16 ${col} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:-translate-y-2 transition-all duration-300`}><Icon size={28} /></div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="pb-10">
          <h2 className="section-title text-center mb-12">Meet the <span className="gradient-text">Leadership</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM.map(({ name, role, photo }) => (
              <div key={name} className="glass-card p-10 text-center hover:border-spice-200 group flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
                  <img src={photo} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-display font-bold text-gray-900 text-xl mb-2">{name}</p>
                <div className="inline-block px-4 py-1.5 bg-spice-50 text-spice-700 rounded-lg text-sm font-semibold tracking-wide">
                  {role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
