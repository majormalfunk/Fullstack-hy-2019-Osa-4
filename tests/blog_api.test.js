const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('Having an initial list of blogs', async () => {

  beforeEach(async () => {
    await Blog.remove({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('Blog id key is in correct format and not _id', async () => {
    const response = await api.get('/api/blogs')
    for (var i = 0; i < response.body.length; i++) {
      expect(response.body[i].id).toBeDefined()
      expect(response.body[i]._id).not.toBeDefined()
    }
  })

  describe('Adding a blog', async () => {

    test('A valid blog can be added ', async () => {

      const newTitle = 'Bloggin´ ´bout bloggin´'

      const newBlog = {
        title: newTitle,
        author: 'Artist formerly known as Blogger',
        url: 'https://blogi.stan',
        likes: 1337
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200) //  200 = OK (201 = Created)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(newTitle)
    })

    test('A blog without a title is not added', async () => {

      const newBlog = {
        author: 'Nobody',
        url: 'http://localhost'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('A blog without a url is not added', async () => {

      const newBlog = {
        title: 'Nothing',
        author: 'Nobody'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('If likes is not defined it is set to 0', async () => {

      const newBlog = {
        title: 'Nobody likes me',
        author: 'Author liked by no-one',
        url: 'http://127.0.0.1'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      expect(addedBlog.likes).toBe(0)
    })

  })

  describe('Deleting a blog', async () => {
    test('Succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(b => b.title)

      expect(titles).not.toContain(blogToDelete.content)
    })
  })

  describe('Updating a blog´s likes', async () => {
    test('Likes are updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[2]
      const likesBefore = blogToUpdate.likes

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd[2]

      expect(updatedBlog.likes).toBe(likesBefore + 1)
    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})