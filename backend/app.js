import "dotenv/config";
import express from "express";
import connectDB from "./data/conn.js";
import cors from "cors";
import portfolioRouter from "./routes/portfolio.js"

const PORT = process.env.PORT;
const app = express();

connectDB();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use("/portfolio", portfolioRouter);

app.use('/storage', express.static('storage'));


app.listen(PORT, () => {
  console.log("Web server in the port:", PORT);
});