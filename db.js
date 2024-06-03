import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/links");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: { type: String, unique: true, index: true }, // Add index for better performance
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const urlAnaticsSchema = new mongoose.Schema({
  shortUrl: { type: mongoose.Schema.Types.String, ref: "Url" },
  views: { type: Number, default: 0 }, // Initialize with a default value
});

const accountSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
});

const Url = mongoose.model("Url", urlSchema);
const User = mongoose.model("User", accountSchema);
const UrlAnatics = mongoose.model("UrlAnatics", urlAnaticsSchema);

export { connectDB, Url, User, UrlAnatics };
