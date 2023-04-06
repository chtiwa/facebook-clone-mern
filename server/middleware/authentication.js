const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const access_token = req.cookies.access_token
  if (!access_token) {
    return res.status(401).json({ message: `Unauthorized` })
  }

  try {
    const payload = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
    req.user = { username: payload.username, userId: payload.userId }
    next()
  } catch (error) {
    throw new BaseError('Unauthorized', 401)
  }
}

module.exports = auth