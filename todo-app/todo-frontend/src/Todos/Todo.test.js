import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Todo from './Todo'

test('renders todo', async  () => {
  const todo = {
    text: 'Test code',
    done: false
  }

  const mockHandler = jest.fn()

  render(<Todo todo={todo} onClickDelete={mockHandler} onClickComplete={mockHandler} />)

  const todoElement = screen.getByText('Test code')
  const doneElement = screen.getByText('This todo is not done')

  expect(todoElement).toBeDefined()
  expect(doneElement).toBeDefined()
})

test('clicking buttons calls event handlers', async () => {
  const todo = {
    text: 'Test code',
    done: false
  }

  const deleteMockHandler = jest.fn()
  const completeMockHandler = jest.fn()

  render(<Todo todo={todo} onClickDelete={deleteMockHandler} onClickComplete={completeMockHandler} />)

  const user = userEvent.setup()

  const deleteButton = screen.getByText('Delete')
  const doneButton = screen.getByText('Set as done')

  await user.click(deleteButton)
  await user.click(doneButton)

  expect(deleteMockHandler.mock.calls).toHaveLength(2)
  expect(completeMockHandler.mock.calls).toHaveLength(1)
})