const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./auth-model')
const { checkUsernameExists } = require('../middleware/restricted')

const { BCRYPT_ROUNDS, JWT_SECRET } = require('../../config')

router.post('/register', async (req, res, next) => {
  let user = req.body
  
  if(!user || !user.username || !user.password) {
    console.log("username and password required")
    return next({ status: 401, message: 'username and password required'})
  }

  const existingUser = await User.findBy({username: user.username})
  
  if(existingUser && existingUser.username  === user.username) {
    next({ status: 401, message: 'username taken'})
  } else {
    const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
    user.password = hash

    User.add(user)
    .then(saved => {
      console.log(saved);
      res.status(201).json(saved)
    })
    .catch(next)
  }
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body

  User.findBy({ username })
    .then((user) => {
      
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user)
        res.status(200).json({ message: `welcome, ${user.username}`, token})
      } else {
        next({ status: 401, message: 'invalid credentials'})
      }
    })
    .catch(next)
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '8h'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
