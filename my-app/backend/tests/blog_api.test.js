const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const { initialBlogs, initialUsers, blogsInDb, usersInDb } =  require('./test_helper')

let authHeader

describe('blogs api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = initialUsers[0]
    await api.post('/api/users').send(user)
    const response = await api.post('/api/login').send(user)
    authHeader = `Bearer ${response.body.token}`
  })

  describe('when there are initially some blog posts saved', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(initialBlogs)
    })

    test('correct amount of blog posts are returned in the JSON format', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body).toHaveLength(initialBlogs.length)
    })
  
    test('unique identifier property of the blog posts is named id', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      response.body.forEach(r => {
        expect(r.id).toBeDefined()
      })
    })

    test('a blog can be edited', async () => {
      const [blogBefore] = await blogsInDb()

      const modifiedBlog = {...blogBefore, title: 'Goto considered useful'}

      await api
        .put(`/api/blogs/${blogBefore.id}`)
        .send(modifiedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      const blogs = await blogsInDb()

      const titles = blogs.map(r => r.title)

      expect(titles).toContain(
        modifiedBlog.title
      )
    })

    describe('addition of a new blog post', () => {
      test('succeeds if a token is provided', async() => {
        const newBlog = {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
        }

        await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
      
        const contents = blogsAtEnd.map(n => n.title)

        expect(contents).toContain(
          newBlog.title
        )
      })

      test('succeeds with status code 201 if likes property is missing from the request', async () => {
        const newBlog = {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        }

        const response = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
        expect(response.body.likes).toBe(0)
      })

      test('fails with status code 400 if title property is missing from the request', async () => {
        const newBlog = {
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
        }

        const response = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      })

      test('fails with status code 400 if url property is missing from the request', async () => {
        const newBlog = {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          likes: 5,
        }
      
        const response = await api
          .post('/api/blogs')
          .set('Authorization', authHeader)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      })

      test('fails with status code 401 if a token is not provided', async() => {
        const newBlog = {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      })
    })
  })

  describe('deletion of a single blog post', () => {
    let id
    beforeEach(async () => {
      await Blog.deleteMany({})

      const blogToDelete = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', authHeader)
        .send(blogToDelete)
      
      id = response.body.id
    })
    
    test('succeeds with status code 204 if id is valid', async () => {
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', authHeader)
        .expect(204)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(0)
    })

    test('fails with status code 401 if authentication header is invalid', async () => {
      await api
        .delete(`/api/blogs/${id}`)
        .expect(401)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async() => {
      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen",
      }
    
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(initialUsers.length + 1)
    
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username less than 3 characters long', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: "ml",
        name: "Matti Luukkainen",
        password: "salainen",
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body.error).toContain('User validation failed: username: Path `username` (`ml`) is shorter than the minimum allowed length (3).')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if password less than 3 characters long', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "sa",
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body.error).toContain('User validation failed: password: Path `password` (`sa`) is shorter than the minimum allowed length (3).')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if username not given', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        name: "Matti Luukkainen",
        password: "salainen",
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if password not given', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body.error).toContain('User validation failed: password: Path `password` is required.')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb()

      const newUser = initialUsers[0]
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique.')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  })

  describe('update information of an individual blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        likes: 11
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      expect(blogsAtEnd[0].likes).toBe(updatedBlog.likes)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/blogs/${invalidId}`)
        .expect(400)
    })

    test('fails with status code 400 if data is invalid', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        likes: "not a number"
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
    })
  })
})
  


afterAll(async () => {
  await mongoose.connection.close()
})