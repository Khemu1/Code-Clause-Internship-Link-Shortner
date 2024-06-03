import express from "express";
import { connectDB } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import bodyParser from "body-parser";
import multer from "multer";
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();

app.post("/user", upload.none(), (req, res) => {
  console.log(req.body);
  return res.status(200).json({ message: "Registration successful" });
});

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
