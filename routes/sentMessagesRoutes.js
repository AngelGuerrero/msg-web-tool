const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es'
const moment = require('moment')

const LIMIT_RESULTS = 30

/**
 * Retorna las fechas desde la fecha de inicio hasta la fecha fin.
 *
 * @param {Date} fromDate Fecha de inicio.
 * @param {Date} toDate Fecha fin.
 * @returns {Array} retval Contiene las fechas de los rangos seleccionados.
 */
const getDatesFromRange = (fromDate, toDate) => {
  const retval = []

  const start = moment(fromDate)
  const end = moment(toDate)

  const daysNumber = end.diff(start, 'days')

  for (let i = daysNumber; i >= 0; i--) {
    const day = moment(toDate).subtract(daysNumber - i, 'days')
    retval.push(day)
  }

  // console.log(JSON.stringify(retval, null, 4))

  return retval
}

/**
 * @returns {Array} retval Retorna un array con las fechas de los últimos 7 días.
 */
const getDatesFromLastSevenDays = () => {
  const retval = []

  for (let i = 7; i > 0; i--) {
    const date = new Date()
    const day = moment(date).subtract(i, 'days')
    retval.push(day)
  }

  // console.log(JSON.stringify(retval, null, 4))

  return retval
}

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const retval = []

  const fromDate = req.query.fromDate || null
  const toDate = req.query.toDate || null

  const dates = (fromDate && toDate) ? getDatesFromRange(fromDate, toDate) : getDatesFromLastSevenDays()

  for (let i = 0; i < LIMIT_RESULTS; i++) {
    retval.push({
      id: i,
      token: faker.git.commitSha(),
      destinatario: faker.name.findName(),
      mensaje: faker.lorem.sentence(),
      fecha: faker.helpers.randomize(dates),
      costo: faker.finance.amount(),
      estado: faker.helpers.randomize(['Leído', 'Entregado', 'Enviado'])
    })
  }

  res.status(200).json(retval)
})

router.post('/', function (req, res) {
  res.send('ok')
})

module.exports = router
