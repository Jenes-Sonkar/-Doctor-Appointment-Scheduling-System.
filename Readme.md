# 🩺 Doctor Appointment Scheduling System

A complete backend solution for managing doctor appointments with real-time availability validation, timezone awareness, and automatic Google Calendar event creation using **n8n workflow automation**.

---

## 🚀 Features

- 🧠 Smart appointment scheduling (no double-booking)
- 🌍 Timezone-aware scheduling (Luxon)
- 🧾 MongoDB persistence for doctors, patients, and appointments
- 🔔 Real-time automation via **n8n webhooks**
- 📅 Automatic Google Calendar event creation
- ⚙️ Modular MVC architecture — production-ready

---

## 🏗️ Folder Structure

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


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Jenes-Sonkar/Advanced_Backend
cd doctor-appointment-backend

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the project root and paste:

PORT=8000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net
DB_NAME=advanced_backend
CORS_ORIGIN=*
N8N_WEBHOOK_URL=https://jenes29.app.n8n.cloud/webhook/book-appointment


⚠️ Use the production URL from n8n (not the test one).

🧠 Database Seeding

Run the seed script to create a doctor and availability:

node -r dotenv/config src/scripts/seedDoctors.js


✅ Example Output:

MongoDB connected: cluster0.mp0johc.mongodb.net
Seeded doctor and availability. doctorId= 68e9f7aa687fa23e27dc4f73


📋 Copy the doctorId shown — you’ll need it for Postman testing.

▶️ Start the Server
npm run dev


✅ Expected Log:

MongoDB connected: cluster0.mp0johc.mongodb.net
Server is running on port 8000

🧪 API Testing (Postman)

Endpoint:

POST http://localhost:8000/api/appointments/request


Headers:

Content-Type: application/json


Body:

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


✅ Expected Response:

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

🤖 n8n + Google Calendar Integration
Step 1 — Create Workflow in n8n

Go to https://jenes29.app.n8n.cloud

Add a Webhook Node

Method: POST

Copy the Production URL

Paste it in .env → N8N_WEBHOOK_URL

Add a Google Calendar Node

Operation: Create an Event

Connect your Google Account

Select your main calendar

Set fields:

Field	Expression
Start Date & Time	{{$json["appointment"]["start"]}}
End Date & Time	{{$json["appointment"]["end"]}}
Summary	Appointment with {{$json["appointment"]["patient"]["name"]}}
Description	Doctor: {{$json["appointment"]["doctor"]["name"]}}
Timezone	{{$json["appointment"]["doctor"]["timezone"]}}

Connect the nodes:

[ Webhook ] → [ Google Calendar ]


Click Save → Execute Workflow.

Send the Postman request again — both nodes will show ✅, and the event appears in Google Calendar.

📅 Google Calendar Result

Event Example:

Title: Appointment with Umar Farook
Time: 11:00 – 11:30 AM
Description: Doctor: Dr. Jones

🧩 Webhook Payload Example
{
  "event": "appointment_confirmed",
  "appointment": {
    "doctor": { "name": "Dr. Jones", "timezone": "Asia/Kolkata" },
    "patient": { "name": "Umar Farook", "email": "umar@example.com" },
    "start": "2025-10-12T11:00:00+05:30",
    "end": "2025-10-12T11:30:00+05:30"
  }
}

🧰 Troubleshooting
Issue	Cause	Fix
"Doctor not found"	Wrong or expired doctorId	Re-run seedDoctors.js and use new ID
"Requested slot outside availability"	Time outside doctor’s hours (9 AM–5 PM)	Use valid range
"n8n webhook failed: 404"	Incorrect webhook URL	Replace with Production URL
No Google Calendar event	Calendar node not mapped or account not connected	Reconnect & re-map fields
🧾 Tech Stack
Category	Technologies
Backend	Node.js, Express.js
Database	MongoDB (Mongoose)
Utilities	Luxon, dotenv, axios
Automation	n8n (Webhook + Google Calendar)
Design Pattern	MVC (Clean Architecture)
👨‍💻 Author

Umar Farook
Backend Developer | IIIT Sonepat
📧 jenessonkar@example.com

🪪 License

Licensed under the MIT License — free to use, modify, and distribute.

🏁 Summary

This project demonstrates:

⚙️ Backend API design (Express + MongoDB)

🌐 Real-time workflow automation (n8n)

📅 External service integration (Google Calendar)

🧩 End-to-end event-driven system

🚀 Ready for deployment and scaling


---

✅ **Now you’re ready to:**
1. Paste this code into your `README.md` file.  
2. Commit & push it:
   ```bash
   git add README.md
   git commit -m "Added final project README"
   git push origin main


Test one last time (Postman → n8n → Google Calendar).