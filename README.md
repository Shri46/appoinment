# Appointment Management System (Monolithic Architecture)

A full-stack Appointment Management System built as a **monolithic application** for a college DevOps / Internal
Assessment project.

## 1. Project Description

The system lets a patient:

1. View available doctors and their appointment slots
2. Book an appointment with a doctor
3. View and cancel their appointments

It is intentionally scoped to these three features only — no authentication, payments, chat, notifications,
prescriptions, medical records, or admin dashboards.

## 2. Functional Requirements

- **View Doctors & Slots** — Browse doctor profiles (name, specialty, experience, fee, description) and see their
  available appointment slots.
- **Book Appointment** — Fill in patient details (name, email, phone) and pick a doctor + slot to book an
  appointment. The backend validates the doctor and slot, prevents double-booking, and marks the slot as booked.
- **View & Cancel Appointments** — See all booked appointments and cancel one. Cancelling releases the slot back to
  availability.

## 3. Why This Is a Monolithic Architecture

Everything the application needs — HTTP routing, validation, business logic (slot availability, double-booking
prevention), and data access (Mongoose/MongoDB) — lives in **one Express application** (`server/`), deployed and run
as a **single process**. There is no separation into independently deployable tiers or services:

- Route handlers in `server/routes/*.js` talk directly to Mongoose models — there are no separate
  controller/service/repository layers or independently running data-access processes.
- The React client is a thin UI that only calls the one backend's REST API; in production the same Express server
  also serves the built React app as static files, so the whole system ships as a **single deployable unit**.
- There is only one server process and one database — no inter-service network calls, no service discovery, no
  independent scaling of "tiers".

This is in contrast to a three-tier design (distinct Presentation / Application / Data layers, possibly deployed
separately) or a microservices design (multiple independently deployable services, each owning its own data). Here,
everything is tightly coupled in one codebase and one runtime.

## 4. Technology Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React (Vite), React Router, Axios, Tailwind CSS |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB (Mongoose ODM)               |
| API style | REST (JSON)                          |

## 5. Project Structure

```
appoinment/
├── server/                  # Monolithic Express backend
│   ├── models/
│   │   ├── Doctor.js
│   │   ├── Slot.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── doctors.js       # GET /api/doctors, GET /api/doctors/:id/slots
│   │   └── appointments.js  # POST/GET /api/appointments, DELETE /api/appointments/:id
│   ├── db.js                 # MongoDB connection
│   ├── seed.js                # Seeds sample doctors + slots
│   ├── server.js              # App entry point (also serves the built React app)
│   └── .env.example
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/       # Navbar, DoctorCard, BookingModal, AppointmentCard
│       ├── pages/             # Dashboard, Doctors, MyAppointments
│       └── services/          # api.js, doctorService.js, appointmentService.js
├── package.json              # Convenience scripts to run both apps together
└── README.md
```

## 6. Database Schema

**doctors**

| Field       | Type   |
|-------------|--------|
| _id         | ObjectId |
| name        | String |
| specialty   | String |
| experience  | Number |
| fee         | Number |
| description | String |

**slots**

| Field     | Type      |
|-----------|-----------|
| _id       | ObjectId  |
| doctorId  | ObjectId (ref Doctor) |
| date      | String    |
| time      | String    |
| isBooked  | Boolean   |

**appointments**

| Field        | Type      |
|--------------|-----------|
| _id          | ObjectId  |
| patientName  | String    |
| email        | String    |
| phone        | String    |
| doctorId     | ObjectId (ref Doctor) |
| slotId       | ObjectId (ref Slot)   |
| date         | String    |
| time         | String    |
| status       | String (`booked` \| `cancelled`) |
| createdAt    | Date      |

## 7. API Endpoints

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/doctors`                 | List all doctors                      |
| GET    | `/api/doctors/:id/slots`       | List slots for a doctor               |
| POST   | `/api/appointments`            | Book an appointment                   |
| GET    | `/api/appointments`            | List all appointments                 |
| DELETE | `/api/appointments/:id`        | Cancel an appointment                 |

Errors return JSON in the form `{ "message": "..." }` with an appropriate HTTP status (400, 404, 409, 500).
Internal stack traces are never sent to the client.

## 8. Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string to a hosted instance)

### Install dependencies

```bash
npm run install:all
```

### Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` if needed:

```
MONGODB_URI=mongodb://127.0.0.1:27017/appointment_system
PORT=5000
```

### Seed the database

```bash
npm run seed
```

This creates 3 doctors (Dr. Ananya Sharma, Dr. Rohan Mehta, Dr. Neha Kapoor) each with 5–8 slots over the next few
days.

### Run in development

```bash
npm run dev
```

This starts the Express API on `http://localhost:5000` and the React dev server on `http://localhost:5173`
(the Vite dev server proxies `/api` requests to the backend).

### Run in production (single deployable unit)

```bash
npm run build:client
npm start
```

This builds the React app and serves it directly from the Express server on `http://localhost:5000`.

## 9. Testing Workflow

1. Open the dashboard at `http://localhost:5173` (dev) or `http://localhost:5000` (prod build).
2. Go to **Doctors**, expand a doctor to view available slots.
3. Select a slot, fill in the booking form, and confirm.
4. Verify the slot now shows as booked (strikethrough/disabled).
5. Go to **My Appointments** and verify the new appointment appears with status `booked`.
6. Cancel the appointment.
7. Verify its status changes to `cancelled`.
8. Return to **Doctors** and confirm the slot is available again.

## 10. Comparison With a Three-Tier / Microservices Approach

| Aspect              | Monolithic (this project)                | Three-Tier                          | Microservices                        |
|---------------------|--------------------------------------------|--------------------------------------|----------------------------------------|
| Deployable units    | 1 (Express serves API + static frontend)  | 3 logical layers, can deploy separately | N independent services              |
| Code organization   | Routes call DB models directly             | Controller → Service → Repository layers | Each service owns its own codebase   |
| Data ownership       | Single shared MongoDB database             | Single shared database, accessed only by the Application tier | Each service typically owns its own database |
| Inter-component calls | Direct function calls within one process | Direct function calls within one process, layered | Network calls (HTTP/RPC) between services |
| Scaling               | Scale the whole app as one unit           | Can scale each tier independently    | Can scale each service independently |
| Complexity            | Lowest — fastest to build and reason about | Medium                               | Highest — operational overhead        |
