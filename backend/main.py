from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, appointments, doctors, patients, medical_records
from database.db import engine
from database import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Healthcare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(medical_records.router)

@app.get("/")
def root():
    return {"message": "Healthcare API is running"}