# 🏥 Healthcare Backend System

A scalable backend system for a digital healthcare platform built using FastAPI.
This project handles authentication, user management (patients & doctors), and provides REST APIs for healthcare services.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based login/register)
* 👨‍⚕️ Doctor & Patient Role Management
* 📅 Appointment System (structure ready)
* 🗂️ Modular Backend Architecture
* ⚡ FastAPI-based high-performance APIs
* 🛢️ PostgreSQL Database Integration

---

## 🧰 Tech Stack

* **Backend:** FastAPI (Python)
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Authentication:** JWT (JSON Web Tokens)
* **Environment:** Python Virtual Environment (venv)

---

## 📁 Project Structure

```
healthcare-project/
│
├── backend/
│   ├── database/        # DB connection & models
│   ├── routers/         # API routes
│   ├── schemas/         # Pydantic schemas
│   ├── utils/           # Utility functions (auth, etc.)
│   ├── main.py          # Entry point
│   ├── .env             # Environment variables (not uploaded)
│
├── frontend/            # (To be implemented)
├── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/healthcare-project.git
cd healthcare-project/backend
```

### 2️⃣ Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

### 4️⃣ Setup Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/healthcare_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## ▶️ Run Server

```
uvicorn main:app --reload
```

---

## 📡 API Documentation

After running the server:

👉 Swagger UI:
http://127.0.0.1:8000/docs

---

## 🔑 API Endpoints

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | /auth/register | Register user    |
| POST   | /auth/login    | Login user       |
| GET    | /              | Health check API |

---

## 🧠 Future Improvements

* Frontend Integration (React / HTML)
* Appointment Booking System
* Medical Records Management
* Deployment (Render / AWS)

---

## 🙌 Author

**Rajvardhan Singh Chouhan**
**Rajvardhan Singh Sisodiiya**
**Rajkumar Patidar**

* GitHub: https://github.com/rajvardhan-here

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
