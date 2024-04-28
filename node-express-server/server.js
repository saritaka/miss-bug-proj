import express from "express";
import cors from "cors";

import { bugService } from "./Services/bug.service.js";
import { loggerService } from "./Services/logger.service.js";

const app = express();

console.log(+new Date());
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

app.listen(3030, () => console.log("Server ready at port 3030"));

app.get("/", (req, res) => res.send("Hello there"));

app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (error) {
    loggerService.error(`couldn't get bug`, error);
    res.status(400).send(`Coudn't get bugs`);
  }
});

app.get("/api/bug/save", async (req, res) => {
  //   console.log(req.query);
  try {
    let bugToSave = {
      _id: req.query._id,
      title: req.query.title,
      severity: +req.query.severity,
      description: req.query.description,
    };
    bugToSave = await bugService.save(bugToSave);
    res.send(bugToSave);
  } catch (error) {
    loggerService.error(`Couldn't save car`, error);
    res.status(400).send(`Couldn't save car`);
  }
});

app.get("/api/bug/:bugId/remove", async (req, res) => {
  try {
    const id = req.params.bugId;
    await bugService.remove(id);
    res.send(`deleted bug ${id}`);
  } catch (error) {
    loggerService.error(`Couldn't delete bug`);
    res.status(400).send(`Couldn't delete bug`);
  }
});

app.get("/api/bug/:bugId", async (req, res) => {
  try {
    const id = req.params.bugId;
    const bug = await bugService.getById(id);
    res.send(bug);
  } catch (error) {
    loggerService.error(`Couldn't get bug`, error);
    res.status(400).send(`Couldn't get bug`);
  }
});

// app.get("/api/logs", async (req, res) => {
//   res.sendFile(process.cwd() + "/logs/backend.log");
// });
