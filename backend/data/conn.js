import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB;

export default async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB con Mongoose");
    } catch (err) {
        console.error("Error al conectar a MongoDB:", err.message);
        process.exit(1);
    }
}
