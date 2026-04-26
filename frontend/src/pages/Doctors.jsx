import { useState, useEffect } from 'react'
import { getAllDoctors, bookAppointment } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState(null)
  const [datetime, setDatetime] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchDoctors() }, [])

  const fetchDoctors = async (spec) => {
    setLoading(true)
    try {
      const res = await getAllDoctors(spec)
      setDoctors(res.data)
    } catch { setDoctors([]) }
    setLoading(false)
  }

  const handleBook = async (doctorId) => {
    if (!localStorage.getItem('token')) return navigate('/login')
    if (!datetime) return setMessage('⚠️ Please select date and time')
    try {
      await bookAppointment(doctorId, datetime)
      setMessage('✅ Appointment booked successfully!')
      setBookingId(null)
      setDatetime('')
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Booking failed'))
    }
  }

  const specializations = ['All', 'Cardiology', 'Neurology', 'Orthopedic', 'Pediatrics', 'General']

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Find Your Doctor</h1>
        <p className="text-gray-500 text-lg">Browse and book appointments with top specialists</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-6 text-center font-medium ${message.includes('✅') ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <input type="text" placeholder="🔍 Search by specialization..."
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-300 shadow-sm"
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchDoctors(search)} />
        <button onClick={() => fetchDoctors(search)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
          Search
        </button>
        <button onClick={() => { setSearch(''); fetchDoctors() }}
          className="border border-gray-200 text-gray-500 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300">
          Clear
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm card-hover border border-gray-100 overflow-hidden group">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                    👨‍⚕️
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Dr. #{doc.id}</h3>
                    <p className="text-teal-100 text-sm">{doc.specialization || 'General Medicine'}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-teal-50 rounded-xl p-3 text-center">
                    <p className="text-teal-600 font-bold text-lg">{doc.experience || 0}</p>
                    <p className="text-gray-500 text-xs">Years Exp.</p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-3 text-center">
                    <p className="text-cyan-600 font-bold text-lg">₹{doc.consultation_fee || 500}</p>
                    <p className="text-gray-500 text-xs">Consult Fee</p>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-4">📅 {doc.available_days || 'Mon-Fri'}</p>

                {bookingId === doc.id ? (
                  <div className="space-y-3">
                    <input type="datetime-local"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 transition-all"
                      value={datetime} onChange={(e) => setDatetime(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => handleBook(doc.id)}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl font-semibold text-sm hover:shadow-md transition-all">
                        ✓ Confirm
                      </button>
                      <button onClick={() => setBookingId(null)}
                        className="flex-1 border border-gray-200 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setBookingId(doc.id)}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}