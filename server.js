import express from "express";
import { connectDB } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.use(express.json());

app.post("/register", (req, res) => {
  console.log(req.body);
  return res.status(200).json({ message: "Registration successful" });
});

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
