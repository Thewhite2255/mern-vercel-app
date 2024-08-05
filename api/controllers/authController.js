const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const generateAccessToken = require('../utils/generateToken')
const errorHandler = require('../utils/errorHandler')
const axios = require('axios')

const register = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errorHandler(400, errors.array()))
  }
  try {
    const { username, name, email, password } = req.body

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })
    if (existingUser) {
      return next(errorHandler(400, 'Email or username already exists'))
    }

    const user = await User.create({
      username,
      email,
      password,
      name,
    })

    generateAccessToken(res, user)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errorHandler(400, errors.array()))
  }
  try {
    const { credential, password } = req.body
    let user
    if (credential.includes('@')) {
      user = await User.findOne({ email: credential })
    } else {
      user = await User.findOne({ username: credential })
    }

    if (!user) {
      return next(errorHandler(401, 'Invalid email or username'))
    }

    if (!(await user.matchPassword(password))) {
      return next(errorHandler(401, 'Invalid password'))
    }

    generateAccessToken(res, user)

    const { password: pass, ...rest } = user._doc

    res.status(200).json({
      success: true,
      user: rest,
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token')

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

const googleCallBack = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    const client = new OAuth2Client(clientId, clientSecret, redirectUri)

    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      response_type: 'code',
      prompt: 'consent',
    })

    res.status(200).json({
      success: true,
      url: authorizeUrl,
    })
  } catch (error) {
    next(error)
  }
}

const googleOauth = async (req, res) => {
  const code = req.query.code

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })

    const { access_token } = response.data

    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    )

    const userInfo = userInfoResponse.data

    let user = await User.findOne({ email: userInfo.email })

    if (!user) {
      user = new User({
        email: userInfo.email,
        username: userInfo.name,
        picture: userInfo.picture,
        googleId: userInfo.sub,
      })

      await user.save()
    }

    generateAccessToken(res, user)

    res.redirect('http://localhost:3000')
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, logout, googleOauth, googleCallBack }
