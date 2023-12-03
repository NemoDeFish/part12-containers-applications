const Todo = ({ todo, onClickDelete, onClickComplete }) => {
  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        {/* Solution: passes a function call to the 'onClick' prop `() => onClickDelete(todo)` instead of the function immediately since the function call is now removed from <List> component and <Todo> is responsible for making the call */}
        <button onClick={onClickDelete(todo)}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        {/* Solution: passes a function call to the 'onClick' prop `() => onClickComplete(todo)` instead of the function immediately since the function call is now removed from <List> component and <Todo> is responsible for making the call */}
        <button onClick={onClickDelete(todo)}> Delete </button>
        <button onClick={onClickComplete(todo)}> Set as done </button>
      </span>
    </>
  )

  return (
    /* Moves <hr/> from <List> to here */
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default Todo