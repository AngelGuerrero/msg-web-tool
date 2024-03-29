const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es'

/**
 * Obtiene una colección de mensajes ya sea enviados, no enviados,
 * entregados y leídos, para mostrar en forma de gráfica y estadísticas.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const name = req.query.name || ''
  const fromDate = req.query.fromDate || '2021-08-01'
  const toDate = req.query.fromDate || '2021-08-07'

  const returnValue = {
    name,
    series: [],
    fromDate,
    toDate
  }

  const LIMIT = faker.helpers.randomize([10])

  for (let i = 0; i < LIMIT; i++) {
    returnValue.series.push(faker.helpers.randomize([575, 300, 890, 155, 640, 540, 800, 250, 230, 400, 630]))
  }

  res.status(200).json(returnValue)
})

module.exports = router
