const { Router } = require('express')
const router = Router()
const faker = require('faker')
faker.locale = 'es_MX'
const _ = require('lodash')

/**
 * Lista URL ACK de la actual instancia del servidor.
 *
 * Nota: Está definida como una lista porque posteriormente se
 * consultará en base al id del usuario para hacer match.
 */
const urlAckList = []

const generateNewUrlAck = userId => ({
  id: _.toInteger(urlAckList.length + 1),
  url: faker.internet.url(),
  habilitada: false,
  userId
})

const findOrFailUrlAck = (prop, value, { req, res }) => {
  const index = _.findIndex(urlAckList, [prop, value])

  if (index === -1) {
    return res.status(404).json({
      error: true,
      data: [],
      message: 'Recurso no encontrado',
      code: 404
    })
  }

  return { item: urlAckList[index], index }
}

/**
 * Obtiene una coleción de todas las URL de ACK.
 *
 * GET
 */
router.get('/', function (req, res) {
  return res.status(200).json(urlAckList)
})

/**
 * Obtiene un registro de url ack basado en el user id.
 *
 * GET
 * */
router.get('/:userId', function (req, res) {
  const userId = _.toNumber(req.params.userId)

  const index = _.findIndex(urlAckList, { userId })

  //
  // Si el item no se ha encontrado,
  // genera uno nuevo y lo guarda en el array.
  if (index === -1) {
    const item = generateNewUrlAck(userId)

    //
    // Guarda el item en el array
    // para asociarlo con el usuario.
    urlAckList.push(item)

    return res.status(200).json(item)
  }

  return res.status(200).json(urlAckList[index])
})

/**
 * Edita un item de la URL ACK.
 *
 * PUT
 */
router.put('/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  const { url, habilitada } = req.body

  const { item, index } = findOrFailUrlAck('id', id, { req, res })

  //
  // Establece los nuevos valores
  item.url = url || item.url
  item.habilitada = habilitada !== undefined ? habilitada : item.habilitada

  // Guarda los cambios
  urlAckList.splice(index, 1, item)

  res.status(200).json(item)
})

module.exports = router
