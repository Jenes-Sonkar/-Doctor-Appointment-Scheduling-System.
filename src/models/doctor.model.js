import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  calendarId: { type: String }, // google calendar id/email for the doctor
  timezone: { type: String, default: "Asia/Kolkata" }
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
