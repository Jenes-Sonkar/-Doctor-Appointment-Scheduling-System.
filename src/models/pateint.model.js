import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.model("Patient", PatientSchema);
