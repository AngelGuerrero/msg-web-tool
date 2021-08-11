const { Router } = require('express')
const router = Router()
const routes = require('./routes.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(routes)
})

module.exports = router
