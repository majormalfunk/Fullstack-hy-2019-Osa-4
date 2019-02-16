const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('When there is initially a single user in the db', async () => {
  beforeEach(async () => {
    await User.remove({})
    const user = new User({ username: 'root', name: 'root user', password: 'TooManySecrets' })
    // This doesn't hash the password. Password is hashed only through the route
    await user.save()
  })

  test('Creating a user with a unique username succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'reader1',
      name: 'Ready Reader',
      password: 'mellon',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Creating a user fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Super User',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})