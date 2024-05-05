import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import { bugService } from "./Services/bug.service.js";
import { loggerService } from "./Services/logger.service.js";

const app = express();

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

import { bugRoutes } from "./api/bug/bug.routes.js";
app.use("/api/bug", bugRoutes);

app.get("/", (req, res) => res.send("Hello there"));

app.get("/api/logs", async (req, res) => {
  res.sendFile(process.cwd() + "/logs/backend.log");
});

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Server ready at port ${port}`));
