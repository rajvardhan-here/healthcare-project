import { useState, useEffect } from 'react'
import { getMyAppointments, getPatientMedicalRecords, updateAppointmentStatus } from '../services/api'
import { Link } from 'react-router-dom'

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([])
  const [records, setRecords] = useState([])
  const [tab, setTab] = useState('appointments')
  const name = localStorage.getItem('name')
  const userId = localStorage.getItem('user_id')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [aptsRes, recsRes] = await Promise.all([
        getMyAppointments(),
        getPatientMedicalRecords(userId)
      ])
      setAppointments(aptsRes.data)
      setRecords(Array.isArray(recsRes.data) ? recsRes.data : [])
    } catch {}
  }

  const cancelAppointment = async (id) => {
    try {
      await updateAppointmentStatus(id, 'cancelled')
      fetchAll()
    } catch {}
  }

  const statusConfig = {
    booked: { color: 'bg-blue-100 text-blue-700', icon: '📅' },
    completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
    cancelled: { color: 'bg-red-100 text-red-600', icon: '❌' },
  }

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: '📅', color: 'from-teal-400 to-cyan-500' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: '✅', color: 'from-green-400 to-teal-500' },
    { label: 'Upcoming', value: appointments.filter(a => a.status === 'booked').length, icon: '⏳', color: 'from-blue-400 to-indigo-500' },
    { label: 'Medical Records', value: records.length, icon: '📋', color: 'from-purple-400 to-pink-500' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <p className="text-teal-100 mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold text-white mb-2">{name} 👋</h1>
          <p className="text-teal-200">Manage your health journey from here</p>
          <Link to="/doctors" className="inline-block mt-4 bg-white text-teal-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm">
            + Book New Appointment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm card-hover border border-gray-100">
            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-xl mb-3 shadow-md`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm w-fit border border-gray-100">
        {[{ key: 'appointments', label: '📅 Appointments' }, { key: 'records', label: '📋 Medical Records' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              tab === t.key ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-gray-500 hover:text-teal-600'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <p className="text-6xl mb-4">📅</p>
              <p className="text-gray-400 text-lg mb-4">No appointments yet</p>
              <Link to="/doctors" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all">
                Book First Appointment →
              </Link>
            </div>
          ) : appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center card-hover border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                  👨‍⚕️
                </div>
                <div>
                  <p className="font-bold text-gray-800">Doctor #{apt.doctor_id}</p>
                  <p className="text-gray-500 text-sm">{new Date(apt.datetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[apt.status]?.color}`}>
                  {statusConfig[apt.status]?.icon} {apt.status}
                </span>
                {apt.status === 'booked' && (
                  <button onClick={() => cancelAppointment(apt.id)}
                    className="text-red-400 hover:text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'records' && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <p className="text-6xl mb-4">📋</p>
              <p className="text-gray-400 text-lg">No medical records yet</p>
            </div>
          ) : records.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6 card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-lg shadow-md">📋</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Medical Record #{r.id}</h3>
                    <p className="text-gray-400 text-sm">By Doctor #{r.doctor_id}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
                  {new Date(r.record_date).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="space-y-2 text-sm bg-gray-50 rounded-xl p-4">
                <p><span className="font-semibold text-gray-700">🔍 Diagnosis:</span> <span className="text-gray-600">{r.diagnosis}</span></p>
                <p><span className="font-semibold text-gray-700">💊 Prescription:</span> <span className="text-gray-600">{r.prescription}</span></p>
                {r.notes && <p><span className="font-semibold text-gray-700">📝 Notes:</span> <span className="text-gray-600">{r.notes}</span></p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}