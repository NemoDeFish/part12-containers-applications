import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler received as props with right details when new blog created', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={addBlog} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write blog author here')
  const urlInput = screen.getByPlaceholderText('write blog url here')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'The Joel Test: 12 Steps to Better Code')
  await user.type(authorInput, 'Joel Spolsky')
  await user.type(urlInput, 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('The Joel Test: 12 Steps to Better Code')
  expect(addBlog.mock.calls[0][0].author).toBe('Joel Spolsky')
  expect(addBlog.mock.calls[0][0].url).toBe('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
})