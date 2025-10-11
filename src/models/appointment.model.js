import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "suggested", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
