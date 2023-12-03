const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis');

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  /* Solution: implements || operator with 0 as default value if 'added_todos' not present. However, I think it is not necessary as I found out that it defaults to 0 by itself */
  const added_todos = Number(await redis.getAsync('added_todos'))
  
  res.send({
    added_todos
  });
});

module.exports = router;
