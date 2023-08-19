const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config')
const { findBy } = require('../auth/auth-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization

  if(token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err) {
        next({ status: 401, message: "token required"})
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    next({ status: 401, message: "token invalid"})
  }
}

  const checkUsernameExists = async (req, res, next) => {
    const incomingUser = req.body

    if(!incomingUser || !incomingUser.username || !incomingUser.password) {
      console.log("username and password required")
      return next({ status: 401, message: 'username and password required'})
    }
  
    try {
      const user = await findBy({ username: incomingUser.username})
      if(!user) {
        next({ status: 401, message: 'username and password required' })
      } else {
        req.user = user
        next()
      }
    } catch(err) {
      next(err)
    }
  }

  module.exports = {
    checkUsernameExists,
    restricted
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

