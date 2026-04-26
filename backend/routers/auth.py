from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from database.db import get_db
from database.models import User, Patient, Doctor
from schemas.schemas import UserResponse, Token
from utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# 🔹 REGISTER
@router.post("/register", response_model=UserResponse)
def register(
    name: str,
    email: str,
    password: str,
    role: str,
    age: int = None,
    gender: str = None,
    blood_group: str = None,
    phone: str = None,
    specialization: str = None,
    experience: int = None,
    consultation_fee: float = None,
    available_days: str = None,
    db: Session = Depends(get_db)
):
    # Check existing user
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    hashed_pw = hash_password(password)
    new_user = User(
        name=name,
        email=email,
        password=hashed_pw,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Patient profile
    if role == "patient":
        new_patient = Patient(
            user_id=new_user.id,
            age=age,
            gender=gender,
            blood_group=blood_group,
            phone=phone
        )
        db.add(new_patient)
        db.commit()

    # Create Doctor profile
    elif role == "doctor":
        new_doctor = Doctor(
            user_id=new_user.id,
            specialization=specialization,
            experience=experience,
            consultation_fee=consultation_fee,
            available_days=available_days
        )
        db.add(new_doctor)
        db.commit()

    return new_user


# 🔹 LOGIN (FIXED FOR SWAGGER OAuth)
@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
# 🔹 ADD THIS AT THE END (do not change existing code)

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user