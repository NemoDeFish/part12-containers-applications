const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})

  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  /* Solution: immediately implement 'todo' inside 'added_todos' instead of separating them */
  let todos = Number(await redis.getAsync('added_todos'))
  /* Solution: uses a || operator instead of a conditional and 0 if not found instead of 1 since the addition is done in the next line */
  // const added_todos = Number(await redis.getAsync("ADDED_TODOS")) || 0;
  const added_todos = todos ? Number(todos) + 1 : 1
  /* Solution: increments the 'added_todos' inside the setAsync function instead of in the variable */
  await redis.setAsync('added_todos', added_todos)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  /* Solution: only allows changes to the 'done' property, but the 'todo' property remains the same */
  // const todo = req.todo;
  // todo.done = req.body.done;

  const body = req.body

  const updatedTodo = {
    ...req.todo._doc,
    ...body
  }

  /* Solution: uses await `todo.save()` instead of `findByIdAndUpdate` */
  const todo = await Todo.findByIdAndUpdate(req.todo._id, updatedTodo, { new: true })
  res.send(todo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
