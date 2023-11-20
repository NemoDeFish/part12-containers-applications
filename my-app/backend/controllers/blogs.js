const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  const blog = new Blog({
    ...body, 
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
   
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog === null) {
    return response.status(401).json({ error: 'blog does not exist' })
  }
  
  const user = request.user

  if (!user || blog.user.toString() !== user._id.toString() ) {
    return response.status(401).json({ error: 'token is not the same as that of the blog\'s creator' })
  } 
  
  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )

  await Blog.findByIdAndRemove(request.params.id)
  await user.save()
  
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const user = request.user

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, 
    request.body, 
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter