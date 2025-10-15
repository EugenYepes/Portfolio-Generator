import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./data/conn.js";
import portfolioRouter from "./routes/portfolio.route.js"
import authRouter from "./routes/auth.route.js"

const PORT = process.env.PORT || 4000; //* Si process.env.PORT es undefined se usara por defecto el puerto 4000
const app = express();

console.log("CLIENT_URL =", process.env.CLIENT_URL);
console.log("PORT =", process.env.PORT);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json()); //* Parsea automáticamente las solicitudes con formato JSON.
app.use(cookieParser()); //* Parsea las cookies de la solicitud

app.use("/portfolio", portfolioRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Web server in the port:", PORT);
});