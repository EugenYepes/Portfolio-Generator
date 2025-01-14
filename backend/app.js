import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./data/conn.js";
import portfolioRouter from "./routes/portfolio.route.js"
import authRouter from "./routes/auth.route.js"

const PORT = process.env.PORT || 4000; //* Si process.env.PORT es undefined se usara por defecto el puerto 4000
const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "https://your-frontend-production-url.com" // Replace with your deployed frontend URL
];

// Configure CORS options
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from whitelisted origins
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and headers with credentials
  })
);

app.use(express.json()); //* Parsea automáticamente las solicitudes con formato JSON.
app.use(cookieParser()); //* Parsea las cookies de la solicitud

app.use('/storage', express.static('storage'));

app.use("/portfolio", portfolioRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Web server in the port:", PORT);
});