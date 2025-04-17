

---

```
# 🚛 Trucker Dispatch & ELD Management Platform

A full-stack web application built for trucking companies to manage trips, drivers, and stay compliant with ELD (Electronic Logging Device) and HOS (Hours of Service) regulations.

---

## 🛠 Tech Stack

**Backend**: Django + Django REST Framework  
**Frontend**: React + Redux Toolkit + Styled Components  
**Maps & Routing**: Leaflet (OpenStreetMap), OpenRouteService  
**Deployment**: Oracle VPS (Backend)
---

## ✨ Features

### 👤 User Roles
- **Carrier Owner**: Signs up company, manages dispatchers & drivers  

- **Driver**: Logs ELD data, views trips  

### 📍 Trip Management
- Create & assign trips to drivers  
- Pick start & end locations via map  
- Auto-calculate distance and show route (Ignored autocalculate for now but to be implemented if needed)  
- Trip statuses: Scheduled, In Progress, Completed, Cancelled  

### 📊 ELD Logs & HOS Rules
- Manual status logging (Driving, On-Duty, Off-Duty, Sleeper)  
- Enforces:
  - 70-hour/8-day rule  
  - 34-hour reset  
  - Fuel every 1000 miles  
  - Pickup/dropoff minimum 1 hour  
- Daily recap of miles and hours  

### 🗺️ Map Dashboard
- Carriers see all active drivers & trips  
- Drivers see their own trip path, location, stops  

---

## 🚀 Getting Started

### 🔧 Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### 💻 Frontend (React)

```bash
cd frontend/spotter
npm install
cp .env.example .env
npm start
```

---

## 📁 Project Structure

```
.
├── backend
│   ├── eld_tracker           # Django project
│   │   ├── eld_tracker       # Main Django settings
│   │   ├── logistics         # App for trips, ELD logs, HOS
│   │   ├── trucks            # App for truck info
│   │   ├── users             # Custom user model & auth
│   │   ├── utils             # Shared utilities/validators
│   │   └── manage.py
│   ├── requirements.txt      # Backend dependencies
│   └── venv/                 # Python virtual environment (Git-ignored)
├── frontend
│   └── spotter               # React frontend
│       ├── public/
│       ├── src/              # App components & pages
│       └── package.json
├── README.md                 # You're reading it!
└── structure.txt             # Folder tree (optional)

# Note: deploy_oracle.sh is used locally and ignored in Git version control.
```

---

## 🔐 Environment Variables

- Rename `.env.example` to `.env` in both `backend` and `frontend/spotter`  
- Add environment-specific variables (e.g., `SECRET_KEY`, `DATABASE_URL`, `REACT_APP_API_URL`, etc.)

---

## 📦 Deployment Notes

Backend & Frontend: Both are deployed manually to Oracle Cloud VPS. The backend and frontend are hosted on the same server, with everything running on the VPS.
---

## 🧑‍💻 Author

Built by **david-kibobo** — _davkirash@gmail.com_  
Feel free to reach out for questions or collaboration!

---


