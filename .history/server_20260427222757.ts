import "express-async-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server/config/db.js";
import "./server/models.js"; // Initialize Mongoose Models
import apiRoutes from "./server/routes/index.js";
import { errorHandler, notFound } from "./server/middleware/error.js";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to Database
  console.log("Attempting to connect to MongoDB...");
  try {
    await connectDB();
    console.log("Database connection sequence completed.");
  } catch (err) {
    console.error("Failed to connect to database during startup:", err);
    // Continue starting server even if DB fails, routes will handle errors
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api", apiRoutes);

  // Catch 404s for API routes to prevent Vite from returning index.html
  app.use("/api", (req, res, next) => {
    res.status(404).json({ message: `API Route Not Found - ${req.originalUrl}` });
  });

  // Seed data check (Optional: could move to a separate script)
  const { Flight } = await import("./server/models/Flight.js");
  const flightCount = await Flight.countDocuments();
  if (flightCount === 0) {
     console.log("Database is empty. You might want to run a seed script.");
     // You can trigger your seed logic here if needed
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handlers
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
