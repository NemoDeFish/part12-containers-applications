import React from 'react'

import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  /* Solution: implements these two functions inside <Todo> component instead of in <List> component */
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map(todo => {
        /* Solution: adds `key={todo.id}` and also passes 'deleteTodo' and 'completeTodo' instead of their respective function calls */ 
        return (<Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />)
        /* Solution: removes the 'reduce' function since the individual todos are no longer accumulated, the <hr /> component is moved to <Todo> */
      }).reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
  )
}

export default TodoList
