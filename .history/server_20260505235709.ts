import "express-async-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server/config/db.js";
import "./server/models.js";
import apiRoutes from "./server/routes/index.js";
import { errorHandler, notFound } from "./server/middleware/error.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  const PORT = process.env.PORT || 3000;

  console.log("Attempting to connect to MongoDB...");
  try {
    await connectDB();
    console.log("Database connection sequence completed. ✅");
  } catch (err) {
    console.error("Failed to connect to database during startup: ❌", err);
  }

  const corsOptions = {
    origin: "https://sky-way-final.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));

  app.options("*", cors(corsOptions));
  app.use(express.json());

  app.use("/api", apiRoutes);

  app.get("/", (req, res) => {
    res.json({ status: "Server is running", message: "SkyWay API is online" });
  });

  app.use("/api", (req, res, next) => {
    res
      .status(404)
      .json({ message: `API Route Not Found - ${req.originalUrl}` });
  });

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT} 🚀`);
  });
}

startServer();
