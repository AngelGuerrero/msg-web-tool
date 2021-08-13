const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es_MX'
const moment = require('moment')

const LIMIT_RESULTS = 2

//
// Lista que actua como base de datos temporal.
const list = []

const getApiKeys = () => {
  for (let i = 0; i < LIMIT_RESULTS; i++) {
    list.push({
      id: i,
      nombre: faker.name.title(),
      key: faker.git.commitSha(),
      secret: faker.git.commitSha(),
      fecha_creacion: moment(new Date()).format(),
      habilitada: faker.helpers.randomize([true, false])
    })
  }

  return list
}

getApiKeys()

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

  const item = {
    id: list[list.length - 1].id + 1,
    nombre,
    key: faker.git.commitSha(),
    secret: faker.git.commitSha(),
    fecha_creacion: moment(new Date()).format(),
    habilitada: true
  }

  list.push(item)

  res.status(200).json(item)
})

module.exports = router
