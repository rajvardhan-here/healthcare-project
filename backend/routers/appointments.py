from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Appointment, Patient, Doctor, User
from datetime import datetime
from utils.auth import get_current_user

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# Book appointment
@router.post("/book")
def book_appointment(
    patient_id: int,
    doctor_id: int,
    appointment_datetime: str,
    db: Session = Depends(get_db)
):
    appointment_dt = datetime.fromisoformat(appointment_datetime)
    
    new_appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        appointment_datetime=appointment_dt,
        status="booked"
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return {
        "message": "Appointment booked successfully",
        "appointment_id": new_appointment.id
    }

# Get my appointments (role-based)
@router.get("/my-appointments")
def get_my_appointments(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_role = current_user["role"]
    user_id = current_user["id"]
    
    if user_role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        appointments = db.query(
            Appointment, Doctor, User
        ).join(
            Doctor, Appointment.doctor_id == Doctor.id
        ).join(
            User, Doctor.user_id == User.id
        ).filter(
            Appointment.patient_id == patient.id
        ).all()
        
        result = []
        for apt, doctor, user in appointments:
            result.append({
                "appointment_id": apt.id,
                "doctor_name": user.name,
                "specialization": doctor.specialization,
                "appointment_datetime": apt.appointment_datetime.isoformat(),
                "status": apt.status
            })
        
        return result
    
    elif user_role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        appointments = db.query(
            Appointment, Patient, User
        ).join(
            Patient, Appointment.patient_id == Patient.id
        ).join(
            User, Patient.user_id == User.id
        ).filter(
            Appointment.doctor_id == doctor.id
        ).all()
        
        result = []
        for apt, patient, user in appointments:
            result.append({
                "appointment_id": apt.id,
                "patient_name": user.name,
                "patient_age": patient.age,
                "patient_phone": patient.phone,
                "appointment_datetime": apt.appointment_datetime.isoformat(),
                "status": apt.status
            })
        
        return result

# Update appointment status
@router.patch("/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    new_status: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_statuses = ["booked", "completed", "cancelled"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    user_role = current_user["role"]
    user_id = current_user["id"]
    
    if user_role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == user_id).first()
        if appointment.patient_id != patient.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    elif user_role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
        if appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    appointment.status = new_status
    db.commit()
    
    return {"message": f"Appointment status updated to {new_status}"}