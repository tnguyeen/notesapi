import jwt from "jsonwebtoken";
import User from "./models/userModel.js";

// 200ok 201created 202accepted 400badreq 401unauth 404notfound
// Create Account
export async function resister(req, res) {
  const { fullname, email, password } = req.body;

  if (!fullname) {
    return res.status(400).json({
      status: "failed",
      message: "fullname is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: "failed",
      message: "password is required",
    });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.status(400).json({
      status: "failed",
      message: "email already exist ",
    });
  }

  const newUser = new User({
    fullname,
    email,
    password,
  });
  await newUser.save();

  const accesstoken = jwt.sign({ newUser }, process.env.JWT_SECRET);
  return res.status(201).json({
    status: "succeed",
    message: "Create User Successfully",
    data: { ...newUser._doc, accessToken: accesstoken },
  });
}

// Login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: "failed",
      message: "password is required",
    });
  }

  const isUser = await User.findOne({ email: email });
  if (!isUser) {
    return res.status(400).json({
      status: "failed",
      message: "email not found",
    });
  }

  if (isUser.email == email && isUser.password == password) {
    const accesstoken = jwt.sign({ isUser }, process.env.JWT_SECRET);

    return res.status(200).json({
      status: "succeed",
      message: "Login Successfully",
      data: { ...isUser._doc, accessToken: accesstoken },
    });
  }
}
