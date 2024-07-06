import mongoose from "mongoose"
const Schema = mongoose.Schema

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: false },
  isPinned: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createOn: { type: Date, required: true, default: new Date().getTime() },
})

export default mongoose.model("Note", noteSchema)
