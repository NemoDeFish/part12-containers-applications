import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [update, setUpdate] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [update])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      await blogService.create(blogObject)
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setUpdate(!update)
    } catch(exception) {
      notifyWith('a new blog not added', 'error')
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      await blogService.like(blogObject)
      setUpdate(!update)
    } catch(exception) {
      notifyWith('blog not updated', 'error')
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject)
      notifyWith(`${blogObject.title} by ${blogObject.author} was deleted`)
      setUpdate(!update)
    } catch(exception) {
      notifyWith(`blog not deleted because blog post was added by ${blogObject.user.name}`, 'error')
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>

      <Notification info={info} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const blogForm = () => (
    <div>
      <h2>blogs</h2>

      <Notification info={info} />

      <p>{user.name} logged in
        <button onClick={() => logoutUser()}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user}/>
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App