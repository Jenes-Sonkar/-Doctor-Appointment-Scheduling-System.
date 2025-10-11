import mongoose from "mongoose";

const DoctorAvailabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  start: { type: Date, required: true }, // absolute ISO datetime (UTC stored)
  end: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);
