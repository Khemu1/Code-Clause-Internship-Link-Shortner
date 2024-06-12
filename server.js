import express from "express";
import { connectDB, UrlAnatics, Url, User } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import multer from "multer";
import session from "express-session";
const app = express();
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
const checkSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
    return;
  }
  res.redirect("./login");
};
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.use(express.json());
const upload = multer();

app.post("/register", upload.none(), async (req, res) => {
  if (!req.body)
    return res.status(400).send({
      success: false,
      body: "You must provide a body to this request",
    });
  try {
    const { email, username, password } = req.body;
    console.log(req.body);
    const user = new User({
      email,
      username,
      password,
    });
    await user.save();
    let userId = await User.find({ email, username });
    req.session.userId = userId;
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

    const usersByUsername = await User.find({ username }).exec();
    const usersByEmail = await User.find({ email }).exec();

    console.log("Users by username:", usersByUsername);
    console.log("Users by email:", usersByEmail);

    let errors = {};

    if (usersByUsername.length > 0) {
      errors.username = "Already used username";
    }

    if (usersByEmail.length > 0) {
      errors.email = "Already used email";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(200).send({
        success: false,
        body: errors,
      });
    }

    return res.status(200).send({
      success: true,
      body: {
        message: "All Valid",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  if (!req.body)
    return res.status(400).send({
      success: false,
      body: "You must provide a body to this request",
    });
  try {
    const { password, email } = req.body;
    const user = await User.find({ email: email, password: password }).exec();
    if (user.length == 0) {
      return res.status(200).send({
        success: false,
        body: {
          error: "Invalid Account",
        },
      });
    }
    const id = user[0]._id.toString();
    req.session.userId = id;
    console.log(req.session.userId);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      body: "Something went wrong while searching for account",
    });
  }
});

app.get("/home", checkSession, (req, res) => {
  res.sendFile("pages/home.html");
});
app.get("/check-session", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        body: "Something went wrong while logging out",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
