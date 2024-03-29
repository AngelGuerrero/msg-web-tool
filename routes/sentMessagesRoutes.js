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
 * @returns {Array} returnValue Contiene las fechas de los rangos seleccionados.
 */
const getDatesFromRange = (fromDate, toDate) => {
  const returnValue = []

  const start = moment(fromDate)
  const end = moment(toDate)

  const daysNumber = end.diff(start, 'days')

  for (let i = daysNumber; i >= 0; i--) {
    const day = moment(toDate).subtract(daysNumber - i, 'days')
    returnValue.push(day)
  }

  return returnValue
}

/**
 * @returns {Array} returnValue Retorna un array con las fechas de los últimos 7 días.
 */
const getDatesFromLastSevenDays = () => {
  const returnValue = []

  for (let i = 7; i > 0; i--) {
    const date = new Date()
    const day = moment(date).subtract(i, 'days')
    returnValue.push(day)
  }

  return returnValue
}

/**
 * Obtiene una colección de registros de mensajes enviados.
 *
 * GET
 * */
router.get('/', function (req, res) {
  const returnValue = []

  const fromDate = req.query.fromDate || null
  const toDate = req.query.toDate || null

  const dates = (fromDate && toDate) ? getDatesFromRange(fromDate, toDate) : getDatesFromLastSevenDays()

  for (let i = 0; i < LIMIT_RESULTS; i++) {
    returnValue.push({
      id: i,
      token: faker.git.commitSha(),
      destinatario: faker.name.findName(),
      mensaje: faker.lorem.sentence(),
      fecha: faker.helpers.randomize(dates),
      costo: faker.finance.amount(),
      estado: faker.helpers.randomize(['Leído', 'Entregado', 'Enviado'])
    })
  }

  res.status(200).json(returnValue)
})

router.post('/', function (req, res) {
  res.send('ok')
})

module.exports = router
