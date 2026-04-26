from database.db import SessionLocal
from database.models import User, Doctor
from utils.auth import hash_password

db = SessionLocal()

doctors_data = [
    {"name": "Dr. Rajesh Sharma", "email": "dr.rajesh.sharma@medicare.com", "spec": "Cardiologist", "exp": 15, "fee": 800, "days": "Mon-Sat", "phone": "+91 98261 45231", "hospital": "Bombay Hospital Indore"},
    {"name": "Dr. Priya Verma", "email": "dr.priya.verma@medicare.com", "spec": "Gynecologist", "exp": 12, "fee": 600, "days": "Mon-Fri", "phone": "+91 98930 12456", "hospital": "CHL Hospital Indore"},
    {"name": "Dr. Amit Joshi", "email": "dr.amit.joshi@medicare.com", "spec": "Orthopedic Surgeon", "exp": 10, "fee": 700, "days": "Tue-Sun", "phone": "+91 99077 34521", "hospital": "Medanta Hospital Indore"},
    {"name": "Dr. Sunita Patel", "email": "dr.sunita.patel@medicare.com", "spec": "Pediatrician", "exp": 8, "fee": 500, "days": "Mon-Sat", "phone": "+91 98272 56789", "hospital": "Choithram Hospital Indore"},
    {"name": "Dr. Vikram Singh", "email": "dr.vikram.singh@medicare.com", "spec": "Neurologist", "exp": 18, "fee": 1000, "days": "Mon-Fri", "phone": "+91 98261 78923", "hospital": "Apollo Hospital Indore"},
    {"name": "Dr. Meera Gupta", "email": "dr.meera.gupta@medicare.com", "spec": "Dermatologist", "exp": 9, "fee": 600, "days": "Mon-Sat", "phone": "+91 99074 23156", "hospital": "Skin Care Clinic Indore"},
    {"name": "Dr. Rahul Malhotra", "email": "dr.rahul.malhotra@medicare.com", "spec": "Psychiatrist", "exp": 11, "fee": 800, "days": "Mon-Fri", "phone": "+91 98930 67834", "hospital": "Mind Care Center Indore"},
    {"name": "Dr. Anjali Tiwari", "email": "dr.anjali.tiwari@medicare.com", "spec": "ENT Specialist", "exp": 7, "fee": 500, "days": "Tue-Sun", "phone": "+91 98261 34567", "hospital": "Vishesh Jupiter Hospital Indore"},
    {"name": "Dr. Sanjay Dubey", "email": "dr.sanjay.dubey@medicare.com", "spec": "General Physician", "exp": 20, "fee": 400, "days": "Mon-Sun", "phone": "+91 99074 89123", "hospital": "City Hospital Indore"},
    {"name": "Dr. Kavita Chouhan", "email": "dr.kavita.chouhan@medicare.com", "spec": "Ophthalmologist", "exp": 13, "fee": 700, "days": "Mon-Sat", "phone": "+91 98272 45678", "hospital": "Eye Care Hospital Indore"},
    {"name": "Dr. Deepak Agarwal", "email": "dr.deepak.agarwal@medicare.com", "spec": "Urologist", "exp": 16, "fee": 900, "days": "Mon-Fri", "phone": "+91 98261 90123", "hospital": "Bombay Hospital Indore"},
    {"name": "Dr. Nisha Saxena", "email": "dr.nisha.saxena@medicare.com", "spec": "Endocrinologist", "exp": 14, "fee": 850, "days": "Tue-Sat", "phone": "+91 99077 12345", "hospital": "Medanta Hospital Indore"},
    {"name": "Dr. Manoj Pandey", "email": "dr.manoj.pandey@medicare.com", "spec": "Gastroenterologist", "exp": 17, "fee": 950, "days": "Mon-Sat", "phone": "+91 98930 34567", "hospital": "CHL Hospital Indore"},
    {"name": "Dr. Shweta Rathore", "email": "dr.shweta.rathore@medicare.com", "spec": "Pulmonologist", "exp": 10, "fee": 750, "days": "Mon-Fri", "phone": "+91 98272 67890", "hospital": "Choithram Hospital Indore"},
    {"name": "Dr. Arun Mishra", "email": "dr.arun.mishra@medicare.com", "spec": "Oncologist", "exp": 22, "fee": 1200, "days": "Mon-Fri", "phone": "+91 98261 23456", "hospital": "Apollo Hospital Indore"},
    {"name": "Dr. Pooja Yadav", "email": "dr.pooja.yadav@medicare.com", "spec": "Rheumatologist", "exp": 9, "fee": 700, "days": "Tue-Sun", "phone": "+91 99074 56789", "hospital": "Vishesh Jupiter Indore"},
    {"name": "Dr. Rohit Khanna", "email": "dr.rohit.khanna@medicare.com", "spec": "Nephrologist", "exp": 15, "fee": 900, "days": "Mon-Sat", "phone": "+91 98930 89012", "hospital": "Medanta Hospital Indore"},
    {"name": "Dr. Smita Jain", "email": "dr.smita.jain@medicare.com", "spec": "Radiologist", "exp": 12, "fee": 800, "days": "Mon-Fri", "phone": "+91 99077 67890", "hospital": "Bombay Hospital Indore"},
    {"name": "Dr. Gaurav Trivedi", "email": "dr.gaurav.trivedi@medicare.com", "spec": "Dentist", "exp": 8, "fee": 400, "days": "Mon-Sun", "phone": "+91 98272 12345", "hospital": "Smile Dental Clinic Indore"},
    {"name": "Dr. Rekha Bhargava", "email": "dr.rekha.bhargava@medicare.com", "spec": "Physiotherapist", "exp": 11, "fee": 500, "days": "Mon-Sat", "phone": "+91 98261 56789", "hospital": "LifeCare Physio Indore"},
]

for d in doctors_data:
    existing = db.query(User).filter(User.email == d["email"]).first()
    if not existing:
        user = User(name=d["name"], email=d["email"], password=hash_password("doctor123"), role="doctor")
        db.add(user)
        db.commit()
        db.refresh(user)
        info = d["days"] + " | " + d["phone"] + " | " + d["hospital"]
        doctor = Doctor(user_id=user.id, specialization=d["spec"], experience=d["exp"], consultation_fee=d["fee"], available_days=info)
        db.add(doctor)
        db.commit()
        print("Added: " + d["name"])
    else:
        print("Already exists: " + d["name"])

db.close()
print("Done! 20 doctors added.")