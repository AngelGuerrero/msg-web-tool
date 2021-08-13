const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es'
const moment = require('moment')

const LIMIT_RESULTS = 30

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const retval = []

  for (let i = 0; i < LIMIT_RESULTS; i++) {
    retval.push({
      id: i,
      nombre: faker.name.findName(),
      key: faker.git.commitSha(),
      secret: faker.git.commitSha(),
      fecha_creacion: moment(new Date()).format(),
      habilitada: faker.helpers.randomize([true, false])
    })
  }

  res.status(200).json(retval)
})

module.exports = router
