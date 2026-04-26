from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User, Patient, Doctor
from utils.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # patient, doctor, admin

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Email already exists check
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Role validation
    if data.role not in ["patient", "doctor", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be: patient, doctor, or admin")

    # Password length check
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    hashed = hash_password(data.password)
    user = User(name=data.name, email=data.email, password=hashed, role=data.role)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto create profile based on role
    if data.role == "patient":
        patient = Patient(user_id=user.id)
        db.add(patient)
        db.commit()

    elif data.role == "doctor":
        doctor = Doctor(user_id=user.id)
        db.add(doctor)
        db.commit()

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "role": user.role
    }


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email not found")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"sub": str(user.id), "role": user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name,
        "user_id": user.id
    }