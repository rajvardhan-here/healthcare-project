import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-teal-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
            ✚
          </div>
          <span className="text-xl font-bold gradient-text">MediCare</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`nav-link font-medium ${location.pathname === '/' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}>
            Home
          </Link>
          <Link to="/doctors" className={`nav-link font-medium ${location.pathname === '/doctors' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}>
            Doctors
          </Link>
          {token && (
            <Link to={role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'}
              className={`nav-link font-medium ${location.pathname.includes('dashboard') ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-300">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 glow-teal">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium text-sm">{name}</span>
              </div>
              <button onClick={logout}
                className="text-gray-500 hover:text-red-500 font-medium transition-colors duration-300 text-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 