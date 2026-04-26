from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Doctor, User
from utils.auth import get_current_user

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.get("/")
def get_all_doctors(specialization: str = None, db: Session = Depends(get_db)):
    query = db.query(Doctor, User).join(User, Doctor.user_id == User.id)
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    results = query.all()
    result = []
    for doctor, user in results:
        result.append({
            "id": doctor.id,
            "user_id": doctor.user_id,
            "name": user.name,
            "specialization": doctor.specialization,
            "experience": doctor.experience,
            "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee else 500,
            "available_days": doctor.available_days
        })
    return result


@router.get("/{doctor_id}")
def get_doctor_by_id(doctor_id: int, db: Session = Depends(get_db)):
    result = db.query(Doctor, User).join(User, Doctor.user_id == User.id).filter(Doctor.id == doctor_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor, user = result
    return {
        "id": doctor.id,
        "name": user.name,
        "specialization": doctor.specialization,
        "experience": doctor.experience,
        "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee else 500,
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
    if specialization: doctor.specialization = specialization
    if experience: doctor.experience = experience
    if consultation_fee: doctor.consultation_fee = consultation_fee
    if available_days: doctor.available_days = available_days
    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor profile updated"}