import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Landing() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const features = [
    { icon: '🩺', title: 'Expert Doctors', desc: 'Connect with verified specialists across 20+ medical fields', color: 'from-teal-400 to-cyan-500' },
    { icon: '📅', title: 'Instant Booking', desc: 'Book appointments in seconds, available 24/7 from anywhere', color: 'from-blue-400 to-indigo-500' },
    { icon: '📋', title: 'Medical Records', desc: 'Secure digital records accessible anytime, anywhere', color: 'from-purple-400 to-pink-500' },
    { icon: '💊', title: 'Prescriptions', desc: 'Digital prescriptions sent directly to your pharmacy', color: 'from-orange-400 to-red-500' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and completely private', color: 'from-green-400 to-teal-500' },
    { icon: '📱', title: 'Always Available', desc: 'Access your health dashboard from any device, anytime', color: 'from-pink-400 to-rose-500' },
  ]

  const stats = [
    { number: '500+', label: 'Expert Doctors' },
    { number: '50K+', label: 'Happy Patients' },
    { number: '20+', label: 'Specializations' },
    { number: '4.9★', label: 'Average Rating' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl float-animation" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl"></div>

        <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-teal-400 rounded-full pulse-glow inline-block"></span>
            Trusted by 50,000+ patients across India
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Health,
            <span className="gradient-text block">Our Priority</span>
          </h1>

          <p className="text-xl text-teal-200/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book appointments with India's top doctors instantly. Get expert medical care from the comfort of your home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 glow-teal">
              Get Started Free →
            </Link>
            <Link to="/doctors"
              className="border-2 border-teal-400/50 text-teal-300 px-10 py-4 rounded-full font-bold text-lg hover:bg-teal-500/10 hover:border-teal-400 transition-all duration-300 backdrop-blur-sm">
              Browse Doctors
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center card-hover p-6 rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">{s.number}</div>
              <div className="text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6 bg-gradient-to-b from-white to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything you need for better health</h2>
            <p className="text-gray-500 text-lg">Comprehensive healthcare management in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm card-hover border border-gray-100 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-teal-100 text-lg mb-8">Join thousands of patients who trust MediCare</p>
          <Link to="/register"
            className="bg-white text-teal-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-block">
            Register Now — It's Free ✨
          </Link>
        </div>
      </div>
    </div>
  )
}