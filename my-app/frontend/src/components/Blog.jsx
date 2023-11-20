import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  let removeVisible = false

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (user.name === blog.user.name) {
    removeVisible = true
  }

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }
  const userWhenVisible = { display: removeVisible ? '' : 'none' }

  const addLikes = () => {
    likeBlog({ ...blog, 'user': blog.user.id, 'likes': blog.likes += 1 })
  }

  const removeBlog = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <div className='blogBefore' style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>view</button>
      </div>
      <div className='blogAfter' style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button> <br />
        {blog.url} <br />
        likes: {blog.likes} <button onClick={addLikes}>like</button> <br />
        {blog.user.name} <br />
        <div style={userWhenVisible}>
          <button onClick={removeBlog}>remove</button>
        </div>
      </div>
    </div>

  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog