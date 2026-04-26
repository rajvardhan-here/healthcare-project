import { useState, useEffect } from 'react'
import { getMyAppointments, addMedicalRecord, updateAppointmentStatus } from '../services/api'

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [selectedApt, setSelectedApt] = useState(null)
  const [recordForm, setRecordForm] = useState({ diagnosis: '', prescription: '', notes: '' })
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState('upcoming')
  const name = localStorage.getItem('name')

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    try {
      const res = await getMyAppointments()
      setAppointments(res.data)
    } catch {}
  }

  const handleAddRecord = async (patientId) => {
    if (!recordForm.diagnosis || !recordForm.prescription) {
      return setMessage('❌ Diagnosis and prescription are required')
    }
    try {
      await addMedicalRecord({ patient_id: patientId, ...recordForm })
      await updateAppointmentStatus(selectedApt.id, 'completed')
      setMessage('✅ Record added and appointment completed!')
      setSelectedApt(null)
      setRecordForm({ diagnosis: '', prescription: '', notes: '' })
      fetchAppointments()
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Failed'))
    }
  }

  const statusConfig = {
    booked: { color: 'bg-blue-100 text-blue-700', icon: '📅' },
    completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
    cancelled: { color: 'bg-red-100 text-red-600', icon: '❌' },
  }

  const filtered = appointments.filter(a => tab === 'upcoming' ? a.status === 'booked' : a.status === 'completed')

  const stats = [
    { label: 'Total Patients', value: appointments.length, icon: '👥', color: 'from-teal-400 to-cyan-500' },
    { label: 'Upcoming', value: appointments.filter(a => a.status === 'booked').length, icon: '📅', color: 'from-blue-400 to-indigo-500' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: '✅', color: 'from-green-400 to-teal-500' },
    { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, icon: '❌', color: 'from-red-400 to-pink-500' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-slate-800 via-teal-800 to-cyan-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <p className="text-teal-300 mb-1">Good day,</p>
          <h1 className="text-3xl font-bold text-white mb-2">Dr. {name} 👨‍⚕️</h1>
          <p className="text-teal-300">Manage your patients and appointments</p>
        </div>
      </div>

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

      {message && (
        <div className={`p-4 rounded-2xl mb-6 font-medium text-center ${message.includes('✅') ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm w-fit border border-gray-100">
        {[{ key: 'upcoming', label: '📅 Upcoming' }, { key: 'completed', label: '✅ Completed' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${tab === t.key ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-gray-500 hover:text-teal-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <p className="text-6xl mb-4">📅</p>
            <p className="text-gray-400 text-lg">No {tab} appointments</p>
          </div>
        ) : filtered.map((apt) => (
          <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-md">🧑</div>
                <div>
                  <p className="font-bold text-gray-800">Patient #{apt.patient_id}</p>
                  <p className="text-gray-500 text-sm">{new Date(apt.datetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[apt.status]?.color}`}>
                  {statusConfig[apt.status]?.icon} {apt.status}
                </span>
                {apt.status === 'booked' && (
                  <button onClick={() => setSelectedApt(selectedApt?.id === apt.id ? null : apt)}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all">
                    + Add Record
                  </button>
                )}
              </div>
            </div>

            {selectedApt?.id === apt.id && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <h3 className="font-bold text-gray-700 mb-4">📋 Add Medical Record</h3>
                <div className="space-y-3">
                  <input placeholder="Diagnosis *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 transition-all bg-white"
                    value={recordForm.diagnosis}
                    onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} />
                  <input placeholder="Prescription *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 transition-all bg-white"
                    value={recordForm.prescription}
                    onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })} />
                  <input placeholder="Notes (optional)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 transition-all bg-white"
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} />
                  <div className="flex gap-3">
                    <button onClick={() => handleAddRecord(apt.patient_id)}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-md transition-all">
                      ✓ Save Record
                    </button>
                    <button onClick={() => setSelectedApt(null)}
                      className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}