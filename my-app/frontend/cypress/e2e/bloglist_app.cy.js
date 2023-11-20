describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    const user2 = {
      name: 'Arto Hellas',
      username: 'hellas',
      password: 'salainen'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notif')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Things I Don\'t Know as of 2018')
      cy.get('#author').type('Dan Abramov')
      cy.get('#url').type('https://overreacted.io/things-i-dont-know-as-of-2018/')
      cy.get('#submit-button').click()

      cy.get('.notif')
        .should('contain', 'a new blog Things I Don\'t Know as of 2018 by Dan Abramov added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('.blog')
        .should('contain', 'Things I Don\'t Know as of 2018')
        .should('contain', 'Dan Abramov')
        .should('contain', 'https://overreacted.io/things-i-dont-know-as-of-2018/')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title:'Things I Don\'t Know as of 2018',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/things-i-dont-know-as-of-2018/'
        })
      })

      it('it can be liked', function() {
        cy.contains('view').click()
        cy.contains('likes: 0')

        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('it can be deleted', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('.notif')
          .should('contain', 'Things I Don\'t Know as of 2018 by Dan Abramov was deleted')
          .and('have.css', 'color', 'rgb(0, 128, 0)')

        cy.wait(5000)

        cy.get('html')
          .should('not.contain', 'Things I Don\'t Know as of 2018')
          .and('not.contain', 'Dan Abramov')
          .and('not.contain', 'https://overreacted.io/things-i-dont-know-as-of-2018/')
      })

      it('it\'s delete button can only be seen by the creator and not anyone else', function() {
        cy.contains('Matti Luukkainen logged in')
        cy.contains('view').click()
        cy.get('.blog')
          .should('contain', 'Matti Luukkainen')
        cy.contains('remove').parent().should('have.css', 'display', 'block')

        cy.contains('logout').click()

        cy.login({ username: 'hellas', password: 'salainen' })

        cy.contains('Arto Hellas logged in')
        cy.contains('view').click()
        cy.get('.blog')
          .should('contain', 'Matti Luukkainen')
        cy.contains('remove').parent().should('have.css', 'display', 'none')
      })
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title:'Title1',
          author: 'Author1',
          url: 'Url1'
        })

        cy.createBlog({
          title:'Title2',
          author: 'Author2',
          url: 'Url2'
        })

        cy.createBlog({
          title:'Title3',
          author: 'Author3',
          url: 'Url3'
        })

        cy.view('Title1 Author1')
        cy.view('Title2 Author2')
        cy.view('Title3 Author3')

        cy.like('Title1 Author1', 3)
        cy.like('Title2 Author2', 2)
        cy.like('Title3 Author3', 1)
      })

      it('it sorts the blogs according to likes with the blog with the most likes being first', function() {
        cy.get('.blog').eq(0).should('contain', 'Title1')
        cy.get('.blog').eq(1).should('contain', 'Title2')
        cy.get('.blog').eq(2).should('contain', 'Title3')
      })
    })
  })
})