/* eslint-disable func-call-spacing */
const { Router } = require('express')
const router = Router()
const _ = require('lodash')
const users = require('../models/users')
const sessions = require('../models/sessions')

const isRegister = (prop, value) => {
  const item = _.find(users.getUsers(), [prop, value])
  if (!item) return { registered: false, message: 'Usuario no registrado' }

  return { registered: true, item }
}

const hasSession = (prop, value) => {
  const item = _.find(sessions.getSessions(), [prop, value])

  if (!item) { return { activeSession: false, message: 'No se ha iniciado sesión' } }

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
  let activeSession;

  ({ registered, message, item } = isRegister('id', id))
  if (!registered) return res.status(404).json({ error: true, message });

  ({ activeSession, message } = hasSession('id', id))
  if (!activeSession) return res.status(401).json({ error: true, message })

  console.log('users.getUsers() :>> ', users.getUsers())
  console.log('sessions.getSessions() :>> ', sessions.getSessions())
  //
  // Elimina la información delicada
  const user = _.clone(item)
  delete user.password

  return res
    .status(200)
    .json({
      data: user,
      message: 'Usuario obtenido correctamente'
    })
})

/**
 * POST
 */
router.post('/register', function (req, res) {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password) {
    return res
      .status(422)
      .json({ error: true, message: 'Los datos son requeridos' })
  }

  const { registered } = isRegister('email', email)
  if (registered) {
    return res
      .status(409)
      .json({ error: true, message: 'Este email ya está registrado' })
  }

  // TODO: Encriptar y desencriptar password sería un plus
  const user = {
    id: _.toInteger(users.getUsers().length + 1),
    nombre,
    email,
    password
  }

  users.addUser(user)
  sessions.addToSession(user)
  console.log('users.getUsers() :>> ', users.getUsers())
  console.log('sessions.getSessions() :>> ', sessions.getSessions())

  return res
    .status(201)
    .json({ data: user, message: 'Usuario correctamente registrado' })
})

/**
 * POST
 */
router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email) {
    return res
      .status(422)
      .json({ error: true, message: 'El email es requerido.' })
  }
  if (!password) {
    return res
      .status(422)
      .json({ error: true, message: 'El password es requerido.' })
  }

  let item
  let message
  let registered
  let activeSession;

  ({ registered, message, item } = isRegister('email', email))
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message })
  }

  ({ activeSession, message } = hasSession('email', email))
  const user = _.clone(item)
  delete user.password
  if (activeSession) {
    return res
      .status(200)
      .json({ error: false, data: user, message: 'El usuario ya está autenticado' })
  }

  if (item.password !== password) {
    return res
      .status(401)
      .json({ error: true, message: 'El email o password son incorrectos' })
  }

  sessions.addToSession(item)
  console.log('users.getUsers() :>> ', users.getUsers())
  console.log('sessions.getSessions() :>> ', sessions.getSessions())

  res.status(201).json({ data: user, message: 'Sesión iniciada corectamente' })
})

router.post('/logout', function (req, res) {
  const { id } = req.body

  const { activeSession } = hasSession('id', id)
  if (!activeSession) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con id: ${id} no tiene sesiones abiertas.` })
  }

  sessions.removeFromSession(id)
  console.log('users.getUsers() :>> ', users.getUsers())
  console.log('sessions.getSessions() :>> ', sessions.getSessions())

  return res
    .status(200)
    .json({ message: 'Sesión cerrada correctamente' })
})

module.exports = router
