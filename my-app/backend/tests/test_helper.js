const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "title1",
    author: "author1",
    url: "url1",
    likes: 1
  },
  {
    title: "title2",
    author: "author2",
    url: "url2",
    likes: 2
  },
]

const initialUsers = [
  { username: 'tester', password: 'secret' }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb
}