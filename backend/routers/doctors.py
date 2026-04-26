from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Doctor, User
from utils.auth import get_current_user

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.get("/")
def get_all_doctors(specialization: str = None, db: Session = Depends(get_db)):
    query = db.query(Doctor)
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    doctors = query.all()
    result = []
    for d in doctors:
        result.append({
            "id": d.id,
            "user_id": d.user_id,
            "specialization": d.specialization,
            "experience": d.experience,
            "consultation_fee": float(d.consultation_fee) if d.consultation_fee else None,
            "available_days": d.available_days
        })
    return result


@router.get("/{doctor_id}")
def get_doctor_by_id(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {
        "id": doctor.id,
        "user_id": doctor.user_id,
        "specialization": doctor.specialization,
        "experience": doctor.experience,
        "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee else None,
        "available_days": doctor.available_days
    }


@router.put("/{doctor_id}")
def update_doctor_profile(
    doctor_id: int,
    specialization: str = None,
    experience: int = None,
    consultation_fee: float = None,
    available_days: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if doctor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if specialization:
        doctor.specialization = specialization
    if experience:
        doctor.experience = experience
    if consultation_fee:
        doctor.consultation_fee = consultation_fee
    if available_days:
        doctor.available_days = available_days

    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor profile updated", "doctor_id": doctor.id}