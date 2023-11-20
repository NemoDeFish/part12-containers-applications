const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const blogsLikes = blogs.map(blog => blog.likes)

  const reducer = (sum, item) => {
    return sum + item
  }

  return blogsLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const blogsLikes = blogs.map(blog => blog.likes)

  const blogMostLikes = blogs.find(blog => blog.likes === Math.max(...blogsLikes))

  return blogs.length === 0 
    ? {}
    : {
      title: blogMostLikes.title,
      author: blogMostLikes.author,
      likes: blogMostLikes.likes
    }
}

const mostBlogs = (blogs) => {
  const authorBlogs = _(blogs)
    .countBy(_.iteratee('author'))
    .entries()
    .maxBy(_.last)

  return blogs.length === 0 
    ? {}
    : {
      author: authorBlogs[0],
      blogs: authorBlogs[1]
    }
}

const mostLikes = (blogs) => {
  const authorLikes = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({ 
      author: key, 
      likes: _.sumBy(value, 'likes')}))
    .maxBy('likes')
    .value()

  return authorLikes === undefined 
    ? {}
    : authorLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}