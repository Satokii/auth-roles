const { PrismaClientKnownRequestError } = require("@prisma/client")
const { createUserDb } = require('../domains/user.js')

const createUser = async (req, res) => {
  const {
    username,
    password,
    role = 'USER'
  } = req.body

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  if (role !== 'ADMIN' && role !== 'USER') {
    return res.status(400).json({ 
      error: "Valid roles are 'USER' or 'ADMIN'"
    })
  }

  try {
    const createdUser = await createUserDb(username, password, role)
    return res.status(201).json({ user: createdUser })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(409).json({ error: "A user with the provided username already exists" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

module.exports = {
  createUser
}
