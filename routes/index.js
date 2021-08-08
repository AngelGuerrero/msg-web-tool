const { Router } = require('express');
const router = Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Hello, Express' });
  res.json('index', { title: 'Hello, Express' });
});

module.exports = router;
