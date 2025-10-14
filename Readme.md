# Doctor Appointment Scheduling System

A complete backend solution for managing doctor appointments with real-time availability validation, timezone awareness, and automatic Google Calendar event creation using **n8n workflow automation**.

---

## Features

- Smart appointment scheduling with overlap prevention
- Timezone-aware scheduling using Luxon
- MongoDB persistence for doctors, patients, and appointments
- Real-time automation through n8n webhooks
- Automatic Google Calendar event creation
- Modular and production-ready MVC architecture

---

## Folder Structure
```
src/
├── app.js # Express setup
├── index.js # Server entry point
├── db/ # MongoDB connection
├── controllers/ # Business logic
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Auth / error handlers
├── utils/ # Helper functions
└── scripts/seedDoctors.js # Doctor & availability seeder
```

---

# Installation & Setup

 1. Clone Repository
```
git clone https://github.com/Jenes-Sonkar/-Doctor-Appointment-Scheduling-System..git
cd doctor-appointment-backend
```
2. Install Dependencies
```
npm install
```
3. Configure Environment Variables
  Create a .env file in the project root and add the following:
```
env
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net
DB_NAME=advanced_backend
CORS_ORIGIN=*
N8N_WEBHOOK_URL=https://jenes29.app.n8n.cloud/webhook/book-appointment
Use the production URL from n8n (not the test one).
```

4. Database Seeding
Run the seed script to create a doctor and availability:
```
node -r dotenv/config src/scripts/seedDoctors.js
```
Example Output:
MongoDB connected: cluster0.mp0johc.mongodb.net
Seeded doctor and availability. doctorId= 68e9f7aa687fa23e27dc4f73
Copy the doctorId displayed in the output. You will use it when testing with Postman.

5. Start the Server
```
npm run dev
```

Expected Log:
MongoDB connected: cluster0.mp0johc.mongodb.net
Server is running on port 8000

6. API Testing (Postman)
Endpoint
```

POST http://localhost:8000/api/appointments/request
```
Headers

Content-Type: application/json
Body
```
json

{
  "doctorId": "68e9f7aa687fa23e27dc4f73",
  "patient": {
    "name": "Umar Farook",
    "email": "umar@example.com",
    "phone": "9999999999"
  },
  "start": "2025-10-12T11:00:00",
  "end": "2025-10-12T11:30:00",
  "timezone": "Asia/Kolkata"
}

```
Expected Response
```
json

{
  "appointment": {
    "id": "6701234567890abcdef1234",
    "doctor": "68e9f7aa687fa23e27dc4f73",
    "patient": "6701234567890abcdef5678",
    "start": "2025-10-12T11:00:00+05:30",
    "end": "2025-10-12T11:30:00+05:30",
    "timezone": "Asia/Kolkata"
  }
}
```

## n8n and Google Calendar Integration

Step 1 — Create Workflow in n8n
```
Log in to https://jenes29.app.n8n.cloud
```

Step 2  —  Add a Webhook Node
- Method: POST

- Copy the Production URL

- Paste it in .env as N8N_WEBHOOK_URL

- Add a Google Calendar Node

- Operation: Create an Event

- Connect your Google Account

- Select your primary calendar

- Set fields as follows:

Field	Expression
```
Start Date & Time	{{$json["appointment"]["start"]}}
End Date & Time	{{$json["appointment"]["end"]}}
Summary	Appointment with {{$json["appointment"]["patient"]["name"]}}
Description	Doctor: {{$json["appointment"]["doctor"]["name"]}}
Timezone	{{$json["appointment"]["doctor"]["timezone"]}}
```
Step 3  — Connect the nodes:

- [ Webhook ] → [ Google Calendar ]
- Save and execute the workflow.
- Send the Postman request again. Both nodes should show successful execution, and the event will appear in Google Calendar.

Google Calendar Result
Example Event:

Title: Appointment with Umar Farook
Time: 11:00 – 11:30 AM
Description: Doctor: Dr. Jones
Webhook Payload Example
```

{
  "event": "appointment_confirmed",
  "appointment": {
    "doctor": { "name": "Dr. Jones", "timezone": "Asia/Kolkata" },
    "patient": { "name": "Umar Farook", "email": "umar@example.com" },
    "start": "2025-10-12T11:00:00+05:30",
    "end": "2025-10-12T11:30:00+05:30"
  }
}
```
Troubleshooting
Issue	Cause	Solution
- Doctor not found	Invalid or expired doctorId	Re-run seedDoctors.js and use the new ID
- Requested slot outside availability	Time outside doctor's working hours (9 AM–5 PM)	Use a valid time range
- n8n webhook failed: 404	Incorrect webhook URL	Replace with the correct production URL
- No Google Calendar event	Node not mapped or account not connected	Reconnect and re-map fields

Tech Stack
```
Category	Technologies
Backend	Node.js, Express.js
Database	MongoDB (Mongoose)
Utilities	Luxon, dotenv, axios
Automation	n8n (Webhook + Google Calendar)
Design Pattern	MVC (Clean Architecture)

```


Summary
- This project demonstrates:

- REST API design and backend architecture using Node.js and Express.js

- Database modeling and validation using MongoDB

- Workflow automation and third-party integration via n8n

- Real-time synchronization with Google Calendar

- End-to-end event-driven backend system ready for deployment
