import { useState, useEffect, useRef } from 'react'
import { getMyAppointments, getPatientMedicalRecords, updateAppointmentStatus } from '../services/api'
import { Link } from 'react-router-dom'

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([])
  const [records, setRecords] = useState([])
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('my_reports')
    return saved ? JSON.parse(saved) : []
  })
  const [tab, setTab] = useState('appointments')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setTimeout(() => {
      const newReports = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        date: new Date().toLocaleDateString('en-IN'),
        url: URL.createObjectURL(file)
      }))
      const updated = [...reports, ...newReports]
      setReports(updated)
      localStorage.setItem('my_reports', JSON.stringify(
        updated.map(r => ({ ...r, url: '' }))
      ))
      setUploading(false)
    }, 800)
  }

  const deleteReport = (id) => {
    const updated = reports.filter(r => r.id !== id)
    setReports(updated)
    localStorage.setItem('my_reports', JSON.stringify(updated))
  }

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📄'
    if (type?.includes('image')) return '🖼️'
    return '📁'
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
    { label: 'My Reports', value: reports.length, icon: '📂', color: 'from-purple-400 to-pink-500' },
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
          <div key={i} onClick={() => s.label === 'My Reports' && setTab('myreports')}
            className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-xl mb-3 shadow-md`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm w-fit border border-gray-100 flex-wrap">
        {[
          { key: 'appointments', label: '📅 Appointments' },
          { key: 'records', label: '📋 Medical Records' },
          { key: 'myreports', label: '📂 My Reports' }
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              tab === t.key ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-gray-500 hover:text-teal-600'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Appointments Tab */}
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
            <div key={apt.id} className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-md">👨‍⚕️</div>
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

      {/* Medical Records Tab */}
      {tab === 'records' && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <p className="text-6xl mb-4">📋</p>
              <p className="text-gray-400 text-lg">No medical records yet</p>
            </div>
          ) : records.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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

      {/* My Reports Tab */}
      {tab === 'myreports' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">📂 My Reports & Documents</h2>
            <button onClick={() => fileInputRef.current.click()}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
              {uploading ? '⏳ Uploading...' : '+ Add Document'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload} className="hidden" />
          </div>

          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <p className="text-6xl mb-4">📂</p>
              <p className="text-gray-400 text-lg mb-4">No reports uploaded yet</p>
              <button onClick={() => fileInputRef.current.click()}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all">
                Upload First Report →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        {getFileIcon(report.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">{report.name}</p>
                        <p className="text-gray-400 text-xs">{report.size} • {report.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {report.url && (
                        <a href={report.url} target="_blank" rel="noreferrer"
                          className="text-teal-500 hover:text-teal-700 text-xs font-medium bg-teal-50 px-3 py-1.5 rounded-lg transition-all">
                          View
                        </a>
                      )}
                      <button onClick={() => deleteReport(report.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium bg-red-50 px-3 py-1.5 rounded-lg transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Upload Button */}
      <button onClick={() => { setTab('myreports'); setTimeout(() => fileInputRef.current?.click(), 100) }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 z-50"
        title="Upload Document">
        📎
      </button>
    </div>
  )
}