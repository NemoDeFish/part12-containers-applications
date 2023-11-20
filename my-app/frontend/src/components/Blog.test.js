import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Things I Don\'t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 51,
    user: {
      username: 'hellas',
      name: 'Arto Hellas',
      id: '650564aba51a0698db7cbcc9'
    },
    id: '6505f88b10a512c51c751513'
  }

  const user = {
    username: 'hellas',
    name: 'Arto Hellas',
    id: '650564aba51a0698db7cbcc9'
  }

  const deleteBlog = jest.fn()
  const likeBlog = jest.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        user={user}
      />
    ).container
  })

  test('renders blog\'s title and author but not URL or number of likes by default', () => {
    const div = container.querySelector('.blogBefore')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('Things I Don\'t Know as of 2018')
    expect(div).toHaveTextContent('Dan Abramov')
    expect(div).not.toHaveTextContent('https://overreacted.io/things-i-dont-know-as-of-2018/')
    expect(div).not.toHaveTextContent('51')
  })

  test('blog\'s URL and number of likes shown when button clicked', async () => {
    let div = container.querySelector('.blogAfter')
    expect(div).toHaveStyle('display: none')

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    div = container.querySelector('.blogAfter')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('https://overreacted.io/things-i-dont-know-as-of-2018/')
    expect(div).toHaveTextContent('51')
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})

