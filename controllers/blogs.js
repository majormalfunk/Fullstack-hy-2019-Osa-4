const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {

  var blog = new Blog(request.body)
  blog.likes = blog.likes === undefined ? 0 : blog.likes

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
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