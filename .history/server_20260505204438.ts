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

  // Render بيدي البورت أوتوماتيك في المتغير ده
  const PORT = process.env.PORT || 3000;

  // 1. Connect to Database
  console.log("Attempting to connect to MongoDB...");
  try {
    await connectDB();
    console.log("Database connection sequence completed. ✅");
  } catch (err) {
    console.error("Failed to connect to database during startup: ❌", err);
  }

  // 2. Middleware
  // تأكد من إضافة لينك الـ Frontend بتاع Vercel هنا لو واجهت مشاكل CORS
  app.use(cors());
  app.use(express.json());

  // 3. API Routes
  app.use("/api", apiRoutes);

  // 4. Health Check (عشان Render يعرف إن السيرفر شغال تمام)
  app.get("/", (req, res) => {
    res.json({ status: "Server is running", message: "SkyWay API is online" });
  });

  // 5. Catch 404s for API routes
  app.use("/api", (req, res, next) => {
    res
      .status(404)
      .json({ message: `API Route Not Found - ${req.originalUrl}` });
  });

  // 6. Error Handlers
  app.use(notFound);
  app.use(errorHandler);

  // 7. Listen
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT} 🚀`);
  });
}

startServer();
