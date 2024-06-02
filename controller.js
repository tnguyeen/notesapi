import jwt from "jsonwebtoken"
import User from "./models/userModel.js"
import Note from "./models/noteModel.js"

// 200ok 201created 202accepted 400badreq 401unauth 404notfound

// Create Account
export async function resister(req, res) {
  const { fullname, email, password } = req.body

  if (!fullname) {
    return res.status(400).json({
      status: "failed",
      message: "fullname is required",
    })
  }
  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "email is required",
    })
  }
  if (!password) {
    return res.status(400).json({
      status: "failed",
      message: "password is required",
    })
  }

  const isUser = await User.findOne({ email: email })
  if (isUser) {
    return res.status(400).json({
      status: "failed",
      message: "email already exist ",
    })
  }

  const newUser = new User({
    fullname,
    email,
    password,
  })

  try {
    await newUser.save()
    const accesstoken = jwt.sign({ newUser }, process.env.JWT_SECRET)
    return res.status(201).json({
      status: "succeed",
      message: "Create User Successfully",
      data: { ...newUser._doc, accessToken: accesstoken },
    })
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Login
export async function login(req, res) {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "email is required",
    })
  }
  if (!password) {
    return res.status(400).json({
      status: "failed",
      message: "password is required",
    })
  }

  const isUser = await User.findOne({ email: email })
  if (!isUser) {
    return res.status(400).json({
      status: "failed",
      message: "email not found",
    })
  }

  if (isUser.email == email && isUser.password == password) {
    const accesstoken = jwt.sign({ isUser }, process.env.JWT_SECRET)

    return res.status(200).json({
      status: "succeed",
      message: "Login Successfully",
      data: { ...isUser._doc, accessToken: accesstoken },
    })
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Invalid Credential",
    })
  }
}

// Get notes by userId
export async function getNotesByUserId(req, res) {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({
      status: "failed",
      message: "userId is required",
    })
  }

  try {

    // const sort = { length: -1 }
    // const limit = 3
    const notes = await Note.find({ userId })
    if (!notes) {
      return res.status(404).json({
        status: "failed",
        message: "not any note not found",
      })
    }

    return res.status(200).json({
      status: "succeed",
      message: "get notes by id Successfully",
      data: notes.sort((x, y) => (x === y ? 0 : x ? -1 : 1)),
    })
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Create Note
export async function createNote(req, res) {
  const { title, content, userId } = req.body

  if (!title) {
    return res.status(400).json({
      status: "failed",
      message: "title is required",
    })
  }
  if (!content) {
    return res.status(400).json({
      status: "failed",
      message: "content is required",
    })
  }
  if (!userId) {
    return res.status(400).json({
      status: "failed",
      message: "userId is required",
    })
  }

  const newNote = new Note({
    title,
    content,
    userId,
  })

  try {
    await newNote.save()
    return res.status(201).json({
      status: "succeed",
      message: "create note successfully",
    })
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Modify Note
export async function modifyNote(req, res) {
  const { title, content, isPinned } = req.body
  const noteId = req.params.noteId

  if (!noteId) {
    return res.status(400).json({
      status: "failed",
      message: "noteId is required",
    })
  }

  if (!title && !content && !isPinned) {
    return res.status(400).json({
      status: "failed",
      message: "no change provided",
    })
  }

  try {
    const note = await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({
        status: "failed",
        message: "note not found",
      })
    }
    title && (note.title = title)
    content && (note.content = content)
    isPinned && (note.isPinned = isPinned)

    await note.save()
    return res.status(200).json({
      status: "succeed",
      message: "note updated",
    })
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Delete Note
export async function deleteNote(req, res) {
  const noteId = req.params.noteId

  if (!noteId) {
    return res.status(400).json({
      status: "failed",
      message: "noteId is required",
    })
  }

  try {
    const note = await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({
        status: "failed",
        message: "note not found",
      })
    }

    await Note.findByIdAndDelete(noteId)
    return res.status(200).json({
      status: "succeed",
      message: "note deleted",
    })
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
}
