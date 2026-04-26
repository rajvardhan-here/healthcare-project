from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import MedicalRecord, User, Patient, Doctor
from utils.auth import get_current_user

router = APIRouter(prefix="/medical-records", tags=["Medical Records"])


@router.post("/")
def add_medical_record(
    patient_id: int,
    diagnosis: str,
    prescription: str,
    notes: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can add medical records")

    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    record = MedicalRecord(
        patient_id=patient_id,
        doctor_id=doctor.id,
        diagnosis=diagnosis,
        prescription=prescription,
        notes=notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Medical record added", "record_id": record.id}


@router.get("/{record_id}")
def get_medical_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return {
        "id": record.id,
        "patient_id": record.patient_id,
        "doctor_id": record.doctor_id,
        "diagnosis": record.diagnosis,
        "prescription": record.prescription,
        "notes": record.notes,
        "record_date": record.record_date
    }