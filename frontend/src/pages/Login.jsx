import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('user_id', res.data.user_id)
      navigate(res.data.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl float-animation" style={{animationDelay: '1.5s'}}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg pulse-glow">
              ✚
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white/60">Login to your MediCare account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-xl mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 font-medium mb-2 text-sm">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 font-medium mb-2 text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 glow-teal disabled:opacity-50 disabled:scale-100"
            >
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <p className="text-center text-white/50 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}