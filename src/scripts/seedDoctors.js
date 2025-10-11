import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "../db/index.js";
import Doctor from "../models/doctor.model.js";
import DoctorAvailability from "../models/doctorAvailability.model.js";
import { DateTime } from "luxon";

const run = async () => {
  await connectDB();

  // change these as you like
  const doctor = await Doctor.findOneAndUpdate(
    { email: "dr.jones@example.com" },
    {
      name: "Dr. Jones",
      email: "dr.jones@example.com",
      calendarId: "dr.jones@example.com", // share this calendar with service account if using Google service account
      timezone: "Asia/Kolkata"
    },
    { upsert: true, new: true }
  );

  // create a sample availability for tomorrow 9:00 - 17:00 local timezone
  const tz = doctor.timezone || "Asia/Kolkata";
  const tomorrow = DateTime.now().setZone(tz).plus({ days: 1 }).startOf("day");
  const start = tomorrow.plus({ hours: 9 }); // 09:00
  const end = tomorrow.plus({ hours: 17 }); // 17:00

  await DoctorAvailability.create({
    doctor: doctor._id,
    start: start.toUTC().toJSDate(),
    end: end.toUTC().toJSDate()
  });

  console.log("Seeded doctor and availability. doctorId=", doctor._id.toString());
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
