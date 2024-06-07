import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bp from "body-parser";

import authenticateToken from "./utils.js";
import {
  resister,
  login,
  getNotesByUserId,
  createNote,
  modifyNote,
  deleteNote,
  getNoteByNoteId,
  deleteUserById,
} from "./controller.js";

const app = express();
dotenv.config({ path: "./.env" });

// env
const PORT = process.env.PORT;
const DB_STRING = process.env.DB_STRING;

// App use
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// routes
app.post("/createAccount", resister);
app.post("/login", login);
app.delete("/delete-user/:userId", deleteUserById);

app.get("/get-note/:userId", getNotesByUserId);
app.get("/get-one-note/:noteId", authenticateToken, getNoteByNoteId);
app.post("/create-note", authenticateToken, createNote);
app.put("/modify-note/:noteId", authenticateToken, modifyNote);
app.delete("/delete-note/:noteId", authenticateToken, deleteNote);

// Connect DB
mongoose
  .connect(DB_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connectted. Server Started at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
