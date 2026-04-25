from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Patient schemas
class PatientCreate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None

class PatientResponse(PatientCreate):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Doctor schemas
class DoctorCreate(BaseModel):
    specialization: str
    experience: Optional[int] = None
    consultation_fee: Optional[float] = None
    available_days: Optional[str] = None

class DoctorResponse(DoctorCreate):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None