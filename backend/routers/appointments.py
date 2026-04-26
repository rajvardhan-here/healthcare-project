from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Appointment, Patient, Doctor, User
from utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/book")
def book_appointment(
    doctor_id: int,
    appointment_datetime: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book appointments")

    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        patient = Patient(user_id=current_user.id, age=None, gender=None, blood_group=None, phone=None)
        db.add(patient)
        db.commit()
        db.refresh(patient)

    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    try:
        if "T" in appointment_datetime:
            dt = datetime.fromisoformat(appointment_datetime.replace("Z", ""))
        else:
            dt = datetime.strptime(appointment_datetime, "%Y-%m-%d %H:%M")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid datetime format")

    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor_id,
        appointment_datetime=dt,
        status="booked"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id,
        "doctor_id": doctor_id,
        "datetime": dt,
        "status": "booked"
    }


@router.get("/my-appointments")
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        appointments = db.query(Appointment).filter(Appointment.patient_id == patient.id).all()
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor:
            return []
        appointments = db.query(Appointment).filter(Appointment.doctor_id == doctor.id).all()
    else:
        return []

    result = []
    for a in appointments:
        result.append({
            "id": a.id,
            "patient_id": a.patient_id,
            "doctor_id": a.doctor_id,
            "datetime": a.appointment_datetime,
            "status": a.status
        })
    return result


@router.patch("/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if status not in ["booked", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status
    db.commit()
    return {"message": f"Status updated to {status}"}