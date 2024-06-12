import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/links");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

const urlSchema = new mongoose.Schema(
  {
    originalUrl: String,
    shortUrl: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "urls" }
);

const urlAnaticsSchema = new mongoose.Schema(
  {
    shortUrl: {  type: mongoose.Schema.Types.String, unique: true,ref: "Url" },
    views: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "urlanatics" }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password : { type: String, required: true}
  },
  { collection: "users" }
);

const Url = mongoose.model("Url", urlSchema);
const User = mongoose.model("User", userSchema);
const UrlAnatics = mongoose.model("UrlAnatics", urlAnaticsSchema);

export { connectDB, Url, User, UrlAnatics };
