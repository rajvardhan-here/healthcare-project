from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Patient, MedicalRecord, User
from utils.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("/{patient_id}")
def get_patient_profile(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": patient.id,
        "user_id": patient.user_id,
        "age": patient.age,
        "gender": patient.gender,
        "blood_group": patient.blood_group,
        "phone": patient.phone
    }


@router.put("/{patient_id}")
def update_patient_profile(patient_id: int, age: int = None, gender: str = None, blood_group: str = None, phone: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Sirf apna profile update kar sakta hai
    if patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if age: patient.age = age
    if gender: patient.gender = gender
    if blood_group: patient.blood_group = blood_group
    if phone: patient.phone = phone

    db.commit()
    db.refresh(patient)
    return {"message": "Profile updated successfully", "patient_id": patient.id}


@router.get("/{patient_id}/medical-records")
def get_medical_records(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    if not records:
        return {"message": "No medical records found", "records": []}
    
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "doctor_id": r.doctor_id,
            "diagnosis": r.diagnosis,
            "prescription": r.prescription,
            "notes": r.notes,
            "record_date": r.record_date
        })
    return result