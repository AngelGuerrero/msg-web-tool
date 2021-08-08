const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es'

const LIMIT = 30

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const retval = []

  for (let i = 0; i < LIMIT; i++) {
    retval.push({
      id: i,
      token: faker.git.commitSha(),
      destinatario: faker.name.findName(),
      mensaje: faker.lorem.sentence(),
      fecha: faker.date.recent(),
      costo: faker.finance.amount(),
      estado: faker.helpers.randomize(['aprovado', 'denegado', 'pendiente'])
    })
  }

  res.status(200).json(retval)
})

router.post('/', function (req, res) {
  res.send('ok')
})

module.exports = router
