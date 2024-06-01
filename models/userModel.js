import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createOn: { type: Date, required: true, default: new Date().getTime() },
});

export default mongoose.model("User", userSchema);
