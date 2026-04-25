from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from database.db import engine
from database import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Healthcare API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Healthcare API is running"}