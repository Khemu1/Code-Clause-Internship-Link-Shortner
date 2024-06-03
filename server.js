import express from "express";
import { connectDB, UrlAnatics, Url, User } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import multer from "multer";
import mongoose from "mongoose";
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.use(express.json());
const upload = multer();

app.post("/user", upload.none(), async (req, res) => {
  if (!req.body)
    return res.status(400).send({
      success: false,
      body: "You must provide a body to this request",
    });
  try {
    const { email, username, password } = req.body;
    const user = new User({
      email,
      username,
      password,
    });
    await user.save();
    return res.status(201).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      body: "Something went wrong while inserting",
    });
  }
});
app.post("/get", async (req, res) => {
  try {
    const { username, email } = req.body;
    console.log(username, email);

    const usersByUsername = await User.find({ username });
    const usersByEmail = await User.find({ email });

    if (usersByUsername.length === 0 && usersByEmail.length === 0) {
      return res.status(200).send({
        success: true,
        body: "No users found",
      });
    }

    if (usersByEmail.length != 0) {
      if (usersByUsername.length != 0) {
        return res.status(200).send({
          success: false,
          body: {
            username: "already used username",
            email: "Already used username",
          },
        });
      }
      return res.status(200).send({
        success: false,
        body: {
          email: "Already used email",
        },
      });
    }

    if (usersByUsername.length != 0) {
      if (usersByEmail.length != 0) {
        return res.status(200).send({
          success: false,
          body: {
            username: "Already used username",
            email: "Already used username",
          },
        });
      }
      return res.status(200).send({
        success: false,
        body: {
          username: "Already used username",
        },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
