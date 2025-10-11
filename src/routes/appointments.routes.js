import express from "express";
import { requestAppointment } from "../controllers/appointments.controller.js";

const router = express.Router();

router.post("/request", requestAppointment);

export default router;
