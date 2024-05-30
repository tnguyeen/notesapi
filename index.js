import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bp from "body-parser"


import authenticateToken from './utils.js'
import User from './models/userModel.js';

const app = express();
dotenv.config({ path: "./.env" })

// env
const PORT = process.env.PORT
const DB_STRING = process.env.DB_STRING

// App use
app.use(
    cors({
        origin: "*"
    })
)
app.use(express.json());
app.use(bp.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({ data: "hello" })
})

// 200ok 201created 202accepted 400badreq 401unauth 404notfound
// Create Account

app.post("/createAccount", async (req, res) => {
    console.log(req.body);
    const { fullname, username, email, password } = req.body

    if (!fullname) {
        return res.status(400).json({
            status: 'failed',
            message: "fullname is required"
        })
    }
    if (!username) {
        return res.status(400).json({
            status: 'failed',
            message: "username is required"
        })
    }
    if (!email) {
        return res.status(400).json({
            status: 'failed',
            message: "email is required"
        })
    }
    if (!password) {
        return res.status(400).json({
            status: 'failed',
            message: "password is required"
        })
    }

    const isUser = await User.findOne({ email: email, username: username })
    if (isUser) {
        return res.status(400).json({
            status: 'failed',
            message: "user already exist "
        })
    }

    const newUser = new User({
        fullname, username, email, password
    })
    await newUser.save()

    const accesstoken = jwt.sign({ newUser }, process.env.JWT_SECRET)
    return res.status(201).json({
        status: 'succeed',
        newUser,
        accesstoken,
        message: "Create User Successfully"
    })
})

// Connect DB
mongoose.connect(DB_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`Connectted. Server Started at ${PORT}`)
    })
}).catch(err => {
    console.log(err);
})
