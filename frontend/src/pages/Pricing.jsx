import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const navigate = useNavigate()

  const UPI_ID = "8120018707@nyes"
  const UPI_NAME = "Rajwardhan Singh Chouhan"

  const plans = [
    {
      name: 'Basic', price: 29, color: 'from-gray-500 to-slate-600',
      features: ['5 Appointments/month', 'Basic Medical Records', 'Email Support', 'Doctor Browse'],
      popular: false
    },
    {
      name: 'Pro', price: 99, color: 'from-teal-500 to-cyan-500',
      features: ['Unlimited Appointments', 'Full Medical Records', 'Priority Support', 'Prescription Access', 'Health Reports', 'Doctor Chat'],
      popular: true
    },
    {
      name: 'Premium', price: 199, color: 'from-purple-500 to-indigo-600',
      features: ['Everything in Pro', 'Home Visit Booking', '24/7 Doctor Chat', 'Family Account (4)', 'Lab Test Booking', 'Health Insurance Help'],
      popular: false
    }
  ]

  const handleSelectPlan = (plan) => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePaymentConfirm = () => {
    setPaymentDone(true)
    setTimeout(() => {
      setShowPayment(false)
      setPaymentDone(false)
      navigate('/patient-dashboard')
    }, 3000)
  }

  const getUPILink = (amount) =>
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=MediCare ${selectedPlan?.name} Plan`

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 text-lg">Choose the plan that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-16">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-white rounded-3xl shadow-sm card-hover overflow-hidden border ${plan.popular ? 'border-teal-400 scale-105 shadow-xl' : 'border-gray-100'}`}>
            {plan.popular && <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-2 text-sm font-bold">⭐ Most Popular</div>}
            <div className={`bg-gradient-to-br ${plan.color} p-8 text-white text-center`}>
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-bold">₹{plan.price}</span>
                <span className="text-white/70 mb-1">/month</span>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-600 text-sm">
                    <span className="text-teal-500 font-bold text-lg">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] ${plan.popular ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg' : 'border-2 border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'}`}>
                Get Started →
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {!paymentDone ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">✚</div>
                  <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
                  <p className="text-gray-500 mt-1">{selectedPlan.name} Plan — ₹{selectedPlan.price}/month</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-4 text-center border border-teal-100">
                  <p className="text-gray-600 font-medium mb-3">Scan QR Code to Pay</p>
                  <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center border-2 border-teal-200 overflow-hidden p-1">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getUPILink(selectedPlan.price))}`}
                      alt="UPI QR Code"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Pay to:</p>
                  <p className="font-bold text-gray-800">{UPI_NAME}</p>
                  <p className="font-bold text-teal-600 text-sm mt-1">{UPI_ID}</p>
                  <p className="text-xs text-gray-400 mt-1">Amount: ₹{selectedPlan.price}</p>
                </div>

                <a href={getUPILink(selectedPlan.price)}
                  className="block w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-bold text-center hover:shadow-lg transition-all mb-3">
                  📱 Open UPI App to Pay
                </a>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { name: 'GPay', emoji: '🟢', link: `gpay://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${selectedPlan.price}&cu=INR` },
                    { name: 'PhonePe', emoji: '🟣', link: `phonepe://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${selectedPlan.price}&cu=INR` },
                    { name: 'Paytm', emoji: '🔵', link: `paytmmp://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${selectedPlan.price}&cu=INR` },
                    { name: 'BHIM', emoji: '🟠', link: getUPILink(selectedPlan.price) },
                  ].map((app) => (
                    <a key={app.name} href={app.link}
                      className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2 hover:bg-teal-50 transition-all border border-gray-100">
                      <span className="text-xl">{app.emoji}</span>
                      <span className="text-xs text-gray-600 font-medium">{app.name}</span>
                    </a>
                  ))}
                </div>

                <div className="bg-yellow-50 rounded-xl p-3 mb-4 text-center">
                  <p className="text-yellow-700 text-xs font-medium">⚠️ Payment ke baad "I've Paid" button dabao</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={handlePaymentConfirm}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                    ✅ I've Paid
                  </button>
                  <button onClick={() => setShowPayment(false)}
                    className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-2">{selectedPlan.name} Plan activated!</p>
                <p className="text-teal-600 font-medium text-sm">Redirecting to dashboard...</p>
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mt-4"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}