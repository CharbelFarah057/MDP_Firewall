const passport = require("passport")
const jwt = require("jsonwebtoken")
const dev = process.env.NODE_ENV !== "production"

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY),
  sameSite: "none",
}

exports.getToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.SESSION_EXPIRY),
  })
}

exports.getRefreshToken = user => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
  })
  return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false })
