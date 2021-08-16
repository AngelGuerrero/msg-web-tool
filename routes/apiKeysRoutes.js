const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es_MX'
const moment = require('moment')
const _ = require('lodash')

const LIMIT_RESULTS = 1

//
// Lista que actua como base de datos temporal.
const list = []

const getItem = () => ({
  id: _.toNumber(list.length + 1),
  nombre: faker.name.title(),
  key: faker.git.commitSha(),
  secret: faker.git.branch(),
  fecha_creacion: moment(new Date()).format(),
  habilitada: faker.helpers.randomize([true, false])
})

Array.from({ length: LIMIT_RESULTS }, (_, i) => i).reduce(
  _ => list.push({ ...getItem() }),
  list
)

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  res.status(200).json(list)
})

/**
 * Agrega una nueva api key ficticia.
 *
 * POST
 */
router.post('/', function (req, res) {
  const { nombre } = req.body

  const item = { ...getItem(), nombre, habilitada: true }

  list.push(item)

  res.status(200).json(item)
})

/**
 * Edita una api key
 *
 * PUT
 */
router.put('/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  const { nombre, habilitada } = req.body

  console.log('nombre :>> ', nombre)
  console.log('habilitada :>> ', habilitada)

  const index = _.findIndex(list, { id })

  if (index === -1) {
    return res.status(404).json({
      error: true,
      data: [],
      message: 'Recurso no encontrado',
      code: 404
    })
  }

  //
  // Establece los nuevos valores
  const item = list[index]
  item.nombre = nombre || item.nombre
  item.habilitada = habilitada !== undefined ? habilitada : item.habilitada

  // Guarda los cambios
  list.splice(index, 1, item)

  res.status(200).json(item)
})

/**
 * Elimina una api key.
 *
 * DELETE
 */
router.delete('/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  const index = _.findIndex(list, { id })

  if (index === -1) {
    return res.status(404).json({
      error: true,
      data: [],
      message: 'Recurso no encontrado',
      code: 404
    })
  }

  // Elimina el elemento
  list.splice(index, 1)

  res.status(200).json({
    error: false,
    message: 'Recurso eliminado satisfactoriamente',
    code: 200
  })
})

module.exports = router
