import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "app.log");
  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read log file" });
    }
    res.type("text/plain").send(data);
  });
});

export default router;