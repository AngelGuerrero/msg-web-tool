const { Router } = require('express')
const router = Router()
const faker = require('faker')

/**
 * Lista que actua como base de datos temporal.
 */
const list = {
  entregados: {
    name: 'entregados',
    value: faker.datatype.number({ min: 1, max: 100 })
  },
  leidos: {
    id: 2,
    name: 'leidos',
    value: faker.datatype.number({ min: 1, max: 100 })
  },
  credito: {
    id: 3,
    name: 'credito',
    value: faker.datatype.number({ min: 1, max: 100 })
  }
}

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const { name } = req.query

  const item = list[name]

  res.status(200).json({ data: item, message: 'Recurso obtenido satisfactoriamente' })
})

module.exports = router
