import { useState, useEffect } from 'react'
import { getAllDoctors, bookAppointment } from '../services/api'
import { useNavigate } from 'react-router-dom'

const doctorAvatars = {
  'Cardiologist': '❤️', 'Gynecologist': '👶', 'Orthopedic Surgeon': '🦴',
  'Pediatrician': '🧒', 'Neurologist': '🧠', 'Dermatologist': '✨',
  'Psychiatrist': '🧘', 'ENT Specialist': '👂', 'General Physician': '🩺',
  'Ophthalmologist': '👁️', 'Urologist': '🏥', 'Endocrinologist': '⚕️',
  'Gastroenterologist': '🫁', 'Pulmonologist': '🫀', 'Oncologist': '🔬',
  'Rheumatologist': '💊', 'Nephrologist': '🩻', 'Radiologist': '📡',
  'Dentist': '🦷', 'Physiotherapist': '💪', 'General': '🩺'
}

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
    if (localStorage.getItem('role') !== 'patient') {
      setMessage('❌ Only patients can book appointments. Please login as patient.')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (!datetime) {
      setMessage('⚠️ Please select date and time first')
      return
    }
    try {
      const isoDatetime = new Date(datetime).toISOString().slice(0, 19)
      await bookAppointment(doctorId, isoDatetime)
      setMessage('✅ Appointment booked successfully! Check your dashboard.')
      setBookingId(null)
      setDatetime('')
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Booking failed. Try again.'))
      setTimeout(() => setMessage(''), 4000)
    }
  }

  const parseAvailableDays = (availableDays) => {
    if (!availableDays) return { days: 'Mon-Fri', phone: '', hospital: '' }
    const parts = availableDays.split(' | ')
    return {
      days: parts[0] || 'Mon-Fri',
      phone: parts[1] || '',
      hospital: parts[2] || 'Indore'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Find Your Doctor in Indore</h1>
        <p className="text-gray-500 text-lg">20+ verified specialists ready to help you</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-6 text-center font-medium text-sm ${
          message.includes('✅') ? 'bg-teal-50 text-teal-700 border border-teal-200' :
          message.includes('⚠️') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
          'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-3 mb-8">
        <input type="text" placeholder="🔍 Search by specialization (e.g. Cardiologist)"
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:border-teal-400 shadow-sm transition-all"
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchDoctors(search)} />
        <button onClick={() => fetchDoctors(search)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
          Search
        </button>
        <button onClick={() => { setSearch(''); fetchDoctors() }}
          className="border border-gray-200 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all text-gray-500">
          Clear
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc) => {
            const info = parseAvailableDays(doc.available_days)
            return (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm card-hover border border-gray-100 overflow-hidden group">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-5 text-center relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    {doctorAvatars[doc.specialization] || '👨‍⚕️'}
                  </div>
                  <h3 className="font-bold text-white text-sm">{doc.name || `Dr. #${doc.id}`}</h3>
                  <p className="text-teal-100 text-xs mt-1 font-medium">{doc.specialization}</p>
                  <div className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">⭐ 4.8</div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-teal-50 rounded-xl p-2 text-center">
                      <p className="text-teal-600 font-bold text-sm">{doc.experience}yr</p>
                      <p className="text-gray-400 text-xs">Experience</p>
                    </div>
                    <div className="bg-cyan-50 rounded-xl p-2 text-center">
                      <p className="text-cyan-600 font-bold text-sm">₹{doc.consultation_fee}</p>
                      <p className="text-gray-400 text-xs">Fee</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <p className="text-gray-500 text-xs">📅 {info.days}</p>
                    {info.phone && <p className="text-gray-500 text-xs">📞 {info.phone}</p>}
                    {info.hospital && <p className="text-gray-500 text-xs">🏥 {info.hospital}</p>}
                    <p className="text-gray-400 text-xs">📍 Indore, MP</p>
                  </div>

                  {bookingId === doc.id ? (
                    <div className="space-y-2">
                      <input type="datetime-local"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-400 transition-all"
                        value={datetime}
                        onChange={(e) => setDatetime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)} />
                      <div className="flex gap-2">
                        <button onClick={() => handleBook(doc.id)}
                          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-xs font-semibold hover:shadow-md transition-all">
                          ✓ Confirm
                        </button>
                        <button onClick={() => { setBookingId(null); setDatetime('') }}
                          className="flex-1 border border-gray-200 py-2 rounded-xl text-xs hover:bg-gray-50 transition-all text-gray-500">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setBookingId(doc.id)}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                      Book Appointment
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}