const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: `Unauthorized` })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { username: payload.username, userId: payload.userId }
    // console.log(req.user)
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = auth