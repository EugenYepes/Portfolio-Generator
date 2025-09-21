import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./data/conn.js";
import portfolioRouter from "./routes/portfolio.route.js"
import authRouter from "./routes/auth.route.js"

const PORT = process.env.PORT || 4000; //* Si process.env.PORT es undefined se usara por defecto el puerto 4000
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); //* Permite que el servidor acepte solicitudes de dominios diferentes al que está alojado
app.use(express.json()); //* Parsea automáticamente las solicitudes con formato JSON.
app.use(cookieParser()); //* Parsea las cookies de la solicitud

app.use("/portfolio", portfolioRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Web server in the port:", PORT);
});