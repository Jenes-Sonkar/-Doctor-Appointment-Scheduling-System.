// 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appointmentsRoutes from "./routes/appointments.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(express.json()); // important
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/appointments", appointmentsRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true, time: new Date() }));

export { app };
