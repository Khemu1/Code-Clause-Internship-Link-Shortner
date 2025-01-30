import express from "express";
import { connectDB, UrlAnatics, Url, User } from "./db.js";
import multer from "multer";
import session from "express-session";
import QRCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = process.env.PORT || 3000;

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const upload = multer();

connectDB();

app.get("/login", (req, res) => {
  console.log("login file requested");
  res.sendFile(path.join(__dirname, "public/pages/login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/home.html"));
});
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/profile.html"));
});

app.post("/register", upload.none(), async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      success: false,
      body: "You must provide a body to this request",
    });
  }
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    const userId = await User.find({ email, username });
    req.session.userId = userId;
    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: "Something went wrong while inserting",
    });
  }
});

app.get("/name", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).send({
        success: false,
        body: { error: "User ID not found in session" },
      });
    }

    const account = await User.findById(userId).exec();
    if (!account) {
      return res.status(404).send({
        success: false,
        body: { error: "User not found" },
      });
    }

    res.status(200).send({
      success: true,
      body: { username: account.username },
    });
  } catch (error) {
    console.error("Error in /name route:", error);
    res.status(500).send({
      success: false,
      body: { error: "Internal server error" },
    });
  }
});

app.post("/get", async (req, res) => {
  try {
    const { username, email } = req.body;
    const usersByUsername = await User.find({ username }).exec();
    const usersByEmail = await User.find({ email }).exec();
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

    res.status(200).send({
      success: true,
      body: { shortUrl: "All Valid" },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      success: false,
      body: "You must provide a body to this request",
    });
  }

  try {
    const { password, email } = req.body;
    console.log(email, password);
    const user = await User.find({ email: email, password: password }).exec();

    if (user.length == 0) {
      return res.status(200).send({
        success: false,
        body: { error: "Invalid Account" },
      });
    }

    const id = user[0]._id.toString();
    req.session.userId = id;
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: "Something went wrong while searching for account",
    });
  }
});

app.post("/insert", upload.none(), async (req, res) => {
  try {
    const { originalUrl, shortUrl } = req.body;
    const userId = req.session.userId;
    let find = await Url.find({ shortUrl: shortUrl }).exec();
    if (find.length > 0) {
      return res.status(200).json({
        success: false,
        body: { message: "This Custom URL Is Already Taken" },
      });
    }

    const qrCode = await QRCode.toDataURL(
      `http://localhost:${port}/link/${shortUrl}`
    );
    const customUrl = new Url({
      originalUrl: originalUrl,
      shortUrl: shortUrl,
      qrCode: qrCode,
      user: userId,
    });
    const urlanatics = new UrlAnatics({
      shortUrl: shortUrl,
      user: userId,
    });

    await customUrl.save();
    await urlanatics.save();

    res.status(200).json({
      success: true,
      body: {
        QRCode: qrCode,
        shortUrl: `http://localhost:${port}/link/${shortUrl}`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the URL" });
  }
});

app.get("/check-session", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.get("/info", async (req, res) => {
  const userId = req.session.userId;
  let info = [];

  try {
    const user = await User.findById(userId).exec();
    const urls = await Url.find({ user: userId }).exec();
    let dataAnatics = await UrlAnatics.find({ user: userId }).exec();
    const analyticsMap = {};

    dataAnatics.forEach((analytic) => {
      analyticsMap[analytic.shortUrl] = analytic.views;
    });

    urls.forEach((url) => {
      info.push({
        username: user.username,
        originalUrl: url.originalUrl,
        shortUrl: `http://localhost:${port}/link/${url.shortUrl}`,
        qrCode: url.qrCode,
        views: analyticsMap[url.shortUrl],
      });
    });

    res.status(200).json({ success: true, body: info });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: "Something went wrong while searching for account",
    });
  }
});

app.get("/link/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const urlDoc = await Url.findOne({ shortUrl: shortUrl });
    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    await UrlAnatics.findOneAndUpdate(
      { shortUrl: shortUrl },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Redirection failed",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(500).send({
        success: false,
        body: "Something went wrong while logging out",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
