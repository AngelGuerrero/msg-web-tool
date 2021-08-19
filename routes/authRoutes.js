/* eslint-disable func-call-spacing */
const { Router } = require('express')
const router = Router()
const _ = require('lodash')
const users = require('../models/users')
const sessions = require('../models/sessions')

const isRegister = (prop, value) => {
  console.log('users.getUsers() :>> ', users.getUsers())
  const item = _.find(users.getUsers(), [prop, value])
  if (!item) return { registered: false, message: 'Usuario no registrado' }

  return { registered: true, item }
}

const hasSession = (prop, value) => {
  console.log('sessions.getSessions() :>> ', sessions.getSessions())
  const item = _.find(sessions.getSessions(), [prop, value])

  if (!item) return { activeSession: false, message: 'No se ha iniciado sesión' }

  return { activeSession: true, item }
}

/**
 * GET
 */
router.get('/me/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  let item
  let message
  let registered
  let activeSession

  ({ registered, message, item } = isRegister('id', id))
  if (!registered) { return res.status(404).json({ error: true, message, code: 404 }) }

  ({ activeSession, message } = hasSession('id', id))
  if (!activeSession) return res.status(401).json({ error: true, message, code: 401 })

  //
  // Elimina la información delicada
  delete item.password

  return res.status(200).json({
    data: item,
    message: 'Usuario obtenido correctamente'
  })
})

/**
 * POST
 */
router.post('/register', function (req, res) {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password) {
    return res.status(422).json({ error: true, message: 'Los datos son requeridos', code: 422 })
  }

  const { registered } = isRegister('email', email)
  if (registered) return res.status(409).json({ error: true, message: 'Este email ya está registrado', code: 409 })

  // TODO: Encriptar y desencriptar password sería un plus
  users.addUser({
    id: _.toInteger(users.getUsers().length + 1),
    nombre,
    email,
    password
  })

  console.log('users.getUsers() :>> ', users.getUsers())

  return res.status(201).json({ message: 'Usuario correctamente registrado' })
})

/**
 * POST
 */
router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email) return res.status(422).json({ error: true, message: 'El email es requerido.' })
  if (!password) return res.status(422).json({ error: true, message: 'El password es requerido.' })

  let item
  let message
  let registered
  let activeSession

  ({ registered, message, item } = isRegister('email', email))
  if (!registered) { return res.status(404).json({ error: true, message, code: 404 }) }

  ({ activeSession, message } = hasSession('email', email))
  if (activeSession) return res.status(401).json({ error: true, message: 'El usuario ya está autenticado', code: 409 })

  if (item.password !== password) {
    return res.status(401).json({
      error: true,
      message: 'El email o password son incorrectos',
      code: 401
    })
  }

  sessions.addToSession(item)

  res.status(201).json({ message: 'Sesión iniciada corectamente' })
})

module.exports = router
