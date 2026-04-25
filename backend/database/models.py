from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.sql import func
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    blood_group = Column(String(5))
    phone = Column(String(15))
    created_at = Column(TIMESTAMP, server_default=func.now())

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialization = Column(String(100), nullable=False)
    experience = Column(Integer)
    consultation_fee = Column(Numeric(10, 2))
    available_days = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    appointment_datetime = Column(TIMESTAMP, nullable=False)
    status = Column(String(20), default="booked")
    created_at = Column(TIMESTAMP, server_default=func.now())

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    diagnosis = Column(Text)
    prescription = Column(Text)
    notes = Column(Text)
    record_date = Column(TIMESTAMP, server_default=func.now())