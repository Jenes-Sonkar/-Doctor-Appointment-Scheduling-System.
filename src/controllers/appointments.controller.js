import Doctor from "../models/doctor.model.js";
import Patient from "../models/pateint.model.js";
import Appointment from "../models/appointment.model.js";
import DoctorAvailability from "../models/doctorAvailability.model.js";
import axios from "axios";
import { DateTime } from "luxon";

/**
 * POST /api/appointments/request
 * body: { doctorId, patient: {name,email,phone}, start, end, timezone? }
 */
export const requestAppointment = async (req, res) => {
  try {
    const { doctorId, patient: patientData, start, end, timezone } = req.body;
    if (!doctorId || !patientData || !start || !end) {
      return res.status(400).json({ message: "doctorId, patient, start and end are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const tz = timezone || doctor.timezone || "UTC";

    // Parse times with luxon using provided timezone (then convert to UTC for DB)
    const startDt = DateTime.fromISO(start, { zone: tz });
    const endDt = DateTime.fromISO(end, { zone: tz });
    if (!startDt.isValid || !endDt.isValid) {
      return res.status(400).json({ message: "Invalid start/end datetime format. Use ISO format." });
    }
    if (endDt <= startDt) {
      return res.status(400).json({ message: "end must be after start" });
    }
    const durationMinutes = endDt.diff(startDt, "minutes").minutes;

    // Convert to JS Date (UTC) for DB comparisons
    const startUTC = startDt.toUTC().toJSDate();
    const endUTC = endDt.toUTC().toJSDate();

    // 1) Check availability: find any availability that fully covers the requested slot
    const avail = await DoctorAvailability.findOne({
      doctor: doctorId,
      start: { $lte: startUTC },
      end: { $gte: endUTC }
    });

    if (!avail) {
      // Suggest next available: find the next availability whose end >= start
      const next = await DoctorAvailability.findOne({
        doctor: doctorId,
        end: { $gte: startUTC }
      }).sort({ start: 1 });

      if (!next) {
        return res.status(409).json({ message: "Requested slot outside availability. No alternates found." });
      }

      const suggestionStart = DateTime.fromJSDate(next.start).setZone(tz);
      const suggestedStartISO = suggestionStart.toISO();
      const suggestedEndISO = suggestionStart.plus({ minutes: durationMinutes }).toISO();

      return res.status(409).json({
        message: "Requested slot unavailable. Here is a suggested slot.",
        suggested: { start: suggestedStartISO, end: suggestedEndISO, timezone: tz }
      });
    }

    // 2) Check for appointment overlap (double-booking)
    const overlap = await Appointment.findOne({
      doctor: doctorId,
      $or: [
        { start: { $lt: endUTC }, end: { $gt: startUTC } }
      ]
    });

    if (overlap) {
      return res.status(409).json({ message: "Requested slot conflicts with existing appointment" });
    }

    // 3) Create or find patient
    let patient = await Patient.findOne({ email: patientData.email });
    if (!patient) {
      patient = await Patient.create(patientData);
    }

    // 4) Create appointment (confirmed)
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patient._id,
      start: startUTC,
      end: endUTC,
      status: "confirmed"
    });

    // 5) Trigger automation (n8n webhook) if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          event: "appointment_confirmed",
          appointment: {
            id: appointment._id,
            doctor: { id: doctor._id, name: doctor.name, calendarId: doctor.calendarId, timezone: doctor.timezone },
            patient: { id: patient._id, name: patient.name, email: patient.email, phone: patient.phone },
            start: DateTime.fromJSDate(startUTC).toISO(),
            end: DateTime.fromJSDate(endUTC).toISO()
          }
        }, { timeout: 5000 });
      } catch (err) {
        console.warn("n8n webhook failed:", err?.message || err);
        // don't fail the whole request — return with warning
      }
    }

    // 6) Return appointment and times in doctor's timezone for client readability
    return res.status(201).json({
      appointment: {
        id: appointment._id,
        doctor: doctorId,
        patient: patient._id,
        start: DateTime.fromJSDate(startUTC).setZone(tz).toISO(),
        end: DateTime.fromJSDate(endUTC).setZone(tz).toISO(),
        timezone: tz
      }
    });

  } catch (error) {
    console.error("requestAppointment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
