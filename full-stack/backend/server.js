import express from "express";
import cors from "cors";
import path from "path";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import cloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import EmployeeRouter from "./routes/EmployeeRoute.js";
import adminRouter from "./routes/adminRoute.js";
import ServiceRouter from "./routes/ServiceRouter.js";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cors());

// Serve static files properly
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/service", ServiceRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
