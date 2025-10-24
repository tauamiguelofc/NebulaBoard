import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: { type: String, default: "" },
  bio: { type: String, default: "Novo por aqui 🚀" },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
