const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const minLen = 3

    try {
      if (body.username.length < minLen) {
        let error = new error
        error.name = 'ValidationError'
        error.message = `Username has to be longer than ${minLen} characters`
        throw error
      }
      if (body.password.length < minLen) {
        let error = new error
        error.name = 'ValidationError'
        error.message = `Password has to be longer than ${minLen} characters`
        throw error
      }
    } catch (error) {
      next(error)
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      password: passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter