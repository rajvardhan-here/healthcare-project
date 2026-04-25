from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User, Patient, Doctor
from schemas.schemas import UserCreate, UserResponse, Token, PatientCreate, DoctorCreate
from utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, patient_data: PatientCreate = None, doctor_data: DoctorCreate = None, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pw = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create patient or doctor profile
    if user.role == "patient" and patient_data:
        new_patient = Patient(user_id=new_user.id, **patient_data.dict())
        db.add(new_patient)
        db.commit()
    
    elif user.role == "doctor" and doctor_data:
        new_doctor = Doctor(user_id=new_user.id, **doctor_data.dict())
        db.add(new_doctor)
        db.commit()
    
    return new_user

@router.post("/login", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}