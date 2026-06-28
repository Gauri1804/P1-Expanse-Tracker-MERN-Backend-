// import express from "express";
// import cors from "cors";
// import { connectDB } from "./DB/Database.js";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";
// import transactionRoutes from "./Routers/Transactions.js";
// import userRoutes from "./Routers/userRouter.js";
// import path from "path";

// dotenv.config({ path: "./config.env" });
// const app = express();

// const port = process.env.PORT;

// connectDB();

// const allowedOrigins = [
//   "https://main.d1sj7cd70hlter.amplifyapp.com",
//   "https://expense-tracker-app-three-beryl.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:5000",
//   // add more origins as needed
// ];

// // Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Router
// app.use("/api/v1", transactionRoutes);
// app.use("/api/auth", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Server is listening on http://localhost:${port}`);
// });







import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config.env" });

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
];

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed");
    console.error(err);
  }
};

startServer();