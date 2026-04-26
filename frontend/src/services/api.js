import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => {
  const formData = new FormData()
  formData.append('username', data.email)
  formData.append('password', data.password)
  return API.post('/auth/login', formData)
}
export const getAllDoctors = (specialization) => API.get('/doctors/', { params: specialization ? { specialization } : {} })
export const bookAppointment = (doctor_id, appointment_datetime) => API.post('/appointments/book', null, { params: { doctor_id, appointment_datetime } })
export const getMyAppointments = () => API.get('/appointments/my-appointments')
export const updateAppointmentStatus = (id, status) => API.patch(`/appointments/${id}/status`, null, { params: { status } })
export const getPatientMedicalRecords = (id) => API.get(`/patients/${id}/medical-records`)
export const addMedicalRecord = (data) => API.post('/medical-records/', null, { params: data })