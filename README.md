# MedNexis - AI-based Healthcare Management System

MedNexis is a complete Full-Stack Web Application designed for a college project demonstration. It features a modern, clean UI for Patients and Doctors to manage appointments, keep track of medical records, and utilize an internal rule-based AI for health suggestions.

## 🚀 Technologies Used
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript, and React.js (via CDN for dynamic Dashboards).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (connected using Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt for secure password hashing.

---

## 📁 Complete Project Structure
```
/MedNexis
│
├── README.md                      # Project documentation and setup guide
│
├── /backend
│   ├── package.json               # Node.js dependencies
│   ├── .env                       # Environment variables (Port, MongoDB URI)
│   ├── server.js                  # Main Express server entry point
│   └── /middleware
│       └── authMiddleware.js      # JWT Token verification logic
│
├── /models                        # Mongoose Database Schemas
│   ├── User.js                    # Users (Patients, Doctors)
│   ├── Appointment.js             # Appointment bookings
│   └── MedicalRecord.js           # Patient medical history & diagnoses
│
├── /routes                        # Backend REST API Endpoints
│   ├── authRoutes.js              # /api/auth/register, /login
│   ├── appointmentRoutes.js       # /api/appointments
│   ├── recordRoutes.js            # /api/records
│   └── aiRoutes.js                # /api/ai/suggest (Rule-based engine)
│
└── /frontend                      # Frontend Static & React Pages
    ├── index.html                 # Login Page
    ├── register.html              # Registration Page
    ├── patient-dashboard.html     # Patient Dashboard (using React.js)
    ├── doctor-dashboard.html      # Doctor Dashboard (using React.js)
    ├── appointments.html          # Appointment Booking View
    ├── records.html               # Medical Records & AI Suggestion View
    ├── /css
    │   └── style.css              # Modern UI Stylesheet
    └── /js
        └── api.js                 # Centralized API fetch wrapper and Auth handling
```

---

## ⚙️ Step-by-Step Setup Instructions

### Prerequisites
1. **Node.js**: Ensure Node.js is installed on your machine.
2. **MongoDB**: You need MongoDB installed locally (or a MongoDB Atlas URI in the `.env` file). Ensure the MongoDB database service is running locally on port `27017`.

### 1. Start the Backend Server
Open your terminal and navigate to the `backend` folder:
```bash
cd backend
npm install
node server.js
```
*You should see a message saying "Connected to MongoDB" and "Server running on port 5000".*

### 2. Run the Frontend
Because we are using ES6 modules and direct file serving, you can just open the HTML files directly in your browser or run a simple local web server:
```bash
# From the project root, start a simple server:
npx serve frontend
```
*Visit `http://localhost:3000` in your web browser.*

---

## 🔗 How Frontend, Backend, and Database are Connected

### The Data Flow
1. **Frontend (HTML/React)**: When a user submits the login form or views the dashboard, the frontend JavaScript makes a `fetch()` HTTP Request using our utility inside `frontend/js/api.js`.
2. **Backend (Node.js + Express)**: The API request hits the Express server (`backend/server.js`). The server routes it to the specific controller (e.g., `routes/appointmentRoutes.js`). If authentication is required, our `authMiddleware.js` verifies the user's JWT token.
3. **Database (MongoDB + Mongoose)**: The Route controller uses the imported Mongoose Data Models (`models/Appointment.js`) to perform CRUD operations (Create, Read, Update, Delete) on the MongoDB Database.
4. **Response**: The Node server sends the queried data back as a JSON response.
5. **UI Update**: The React.js frontend component receives the JSON data and automatically re-renders the DOM to show charts, lists, and tables interactively!

---

## 🗄️ Database Structure & Sample JSON Outputs

Here is how data is stored in the MongoDB database for **MedNexis**.

### 1. `users` Collection
Stores Doctor and Patient credentials securely.
```json
{
  "_id": { "$oid": "641c2bfa923abcd123456789" },
  "name": "Dr. Sarah Smith",
  "email": "sarah@mednexis.com",
  "password": "$2a$10$wKqJwYm/R0B...", // Hashed via Bcrypt
  "role": "Doctor",
  "createdAt": "2023-08-15T10:00:00.000Z",
  "updatedAt": "2023-08-15T10:00:00.000Z",
  "__v": 0
}
```

### 2. `appointments` Collection
Links a Patient user to a Doctor user.
```json
{
  "_id": { "$oid": "641c2c2f923abcd12345678a" },
  "patient": { "$oid": "641c2bfa923abcd123456111" },
  "doctor": { "$oid": "641c2bfa923abcd123456789" },
  "date": "2023-08-20T14:30:00.000Z",
  "status": "Pending",
  "createdAt": "2023-08-15T11:20:00.000Z",
  "updatedAt": "2023-08-15T11:20:00.000Z",
  "__v": 0
}
```

### 3. `medicalrecords` Collection
Holds sensitive patient history and the prescribed medicines/diagnoses.
```json
{
  "_id": { "$oid": "641c2c8f923abcd12345678b" },
  "patient": { "$oid": "641c2bfa923abcd123456111" },
  "history": "Patient reported persistent high fever for 3 days and severe body ache.",
  "diagnosis": "Viral Infection with Fever",
  "medicines": "Paracetamol 500mg, Advil",
  "createdAt": "2023-08-20T15:00:00.000Z",
  "updatedAt": "2023-08-20T15:00:00.000Z",
  "__v": 0
}
```

### 🤖 How the Rule-Based AI Engine Works
By navigating to the "Patient Records" view, a Doctor adding a record can enter symptoms into the "Diagnosis & Symptoms" input. Clicking `Get AI Suggestion` automatically matches keywords against clinical scenarios defined in `/routes/aiRoutes.js`. 
For example, submitting "fever" will output:
**AI Suggestion**: *Rest, hydrate, and take paracetamol if temperature > 38.5°C.*
