import express from "express";
import routes from "./routes.js";
import cors from "cors";


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api", routes);



app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;