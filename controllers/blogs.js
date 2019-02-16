const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    var blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes = body.likes === undefined ? 0 : body.likes,
      user: user.id
    })

    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }

  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Token missing' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    console.log('blog', blog)
    if (blog === undefined || blog === null) {
      return response.status(400).json({ error: 'Invalid blog id' })
    }

    if (blog.user.toString() === user.id) {
      try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
      } catch (exception) {
        next(exception)
      }
    }
  } catch (exception) {
    next(exception)
  }



})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    let blogToUpdate = await Blog.findById(request.params.id)
    blogToUpdate.likes = blogToUpdate.likes + 1

    await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
    response.json(blogToUpdate.toJSON())
  } catch (exception) {
    next(exception)
  }

})

module.exports = blogsRouter