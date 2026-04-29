# 🏥 MediCare — Digital Healthcare Platform

A full-stack digital healthcare web application inspired by Practo.
Built with React.js + FastAPI + PostgreSQL — fully deployed and live!

🌐 **Live Demo:** https://healthcare-backend-beige.vercel.app
💻 **GitHub:** https://github.com/rajvardhan-here/healthcare-project

---

## 🚀 Features

- 🔐 User Authentication (JWT-based Register/Login)
- 👨‍⚕️ 20+ Verified Doctors Listing (Indore)
- 📅 Appointment Booking System
- 📊 Patient Dashboard with Stats
- 📂 My Reports (Document Upload & View)
- 💊 Medical Records Management
- 👨‍⚕️ Doctor Dashboard
- 💳 Pricing Plans Page
- 📱 Fully Responsive UI

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| ORM | SQLAlchemy |
| Authentication | JWT (JSON Web Tokens) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---
## 📁 Project Structure

```bash
healthcare-project/
├── backend/
│   ├── database/        # DB connection & models
│   ├── routers/         # API routes (auth, appointments, etc.)
│   ├── schemas/         # Pydantic schemas
│   ├── utils/           # Utility functions
│   ├── main.py          # Entry point
│   ├── add_doctors.py
│   ├── fix_db.py
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│
├── vercel.json
├── vite.config.js
└── README.md
```
## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/rajvardhan-here/healthcare-project.git
cd healthcare-project

### 2️⃣ Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

### 3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

---

## 🌍 Environment Variables

Create .env file in backend folder:

DATABASE_URL=postgresql://username:password@host:5432/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

---

## 📡 API Documentation

After running backend server:
👉 Swagger UI: http://127.0.0.1:8000/docs

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /doctors/ | Get all doctors |
| GET | /doctors/{id} | Get doctor by ID |
| POST | /appointments/book | Book appointment |
| GET | /appointments/my-appointments | Get my appointments |
| PATCH | /appointments/{id}/status | Update appointment status |
| GET | /patients/{id} | Get patient profile |
| PUT | /patients/{id} | Update patient profile |
| GET | /patients/{id}/medical-records | Get medical records |
| POST | /medical-records/ | Add medical record |
| GET | / | Health check |

---

## 🧠 Future Improvements

- 💳 Payment Gateway (Razorpay)
- 📹 Video Consultation Feature
- 📱 Mobile App (React Native)
- 🔔 Appointment Reminders (Email/SMS)
- ⭐ Doctor Rating & Review System
- 🏥 Real Hospital Partnerships

---

## 🙌 Team

| Name | Role |
|------|------|
| Rajvardhan Singh Chouhan | Python Developer |
| Rajvardhan Singh Sisodia | Software Developer |
| Rajkumar Patidar | web Developer |

GitHub: https://github.com/rajvardhan-here

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
