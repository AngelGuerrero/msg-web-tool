/* eslint-disable func-call-spacing */
const { Router } = require('express')
const router = Router()
const _ = require('lodash')
const users = require('../models/users')
const sessions = require('../models/sessions')
const { UserFactory } = require('../models/user')
const userFactory = new UserFactory()

const hasSession = (prop, value) => {
  const item = _.find(sessions.getSessions(), [prop, value])

  if (!item) { return { activeSession: false, message: 'No se ha iniciado sesión' } }

  return { activeSession: true, item }
}

/**
 * me
 *
 * GET
 */
router.get('/me/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  let index
  let message
  let registered
  let activeSession;

  ({ registered, message, index } = users.isRegister('id', id))
  if (!registered) return res.status(404).json({ error: true, message });

  ({ activeSession, message } = hasSession('id', id))
  if (!activeSession) return res.status(401).json({ error: true, message })

  const user = users.getUsers()[index].getUser()

  return res
    .status(200)
    .json({
      data: user,
      message: 'Usuario obtenido correctamente'
    })
})

/**
 * register
 *
 * POST
 */
router.post('/register', function (req, res) {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password) {
    return res
      .status(422)
      .json({ error: true, message: 'Los datos son requeridos' })
  }

  const { registered } = users.isRegister('email', email)
  if (registered) {
    return res
      .status(409)
      .json({ error: true, message: 'Este email ya está registrado' })
  }

  const id = _.toInteger(users.getUsers().length + 1)
  const user = userFactory.createUser(id, nombre, email, password)

  users.addUser(user)
  sessions.addToSession(user)

  return res
    .status(201)
    .json({ data: user.getUser(), message: 'Usuario correctamente registrado' })
})

/**
 * login
 *
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

  let index
  let message
  let registered
  let activeSession;

  ({ registered, message, index } = users.isRegister('email', email))
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message })
  }

  ({ activeSession, message } = hasSession('email', email))
  const user = users.getUsers()[index].getUser()
  if (activeSession) {
    return res
      .status(200)
      .json({ error: false, data: user, message: 'El usuario ya está autenticado' })
  }

  if (!users.getUsers()[index].matchPassword(password)) {
    return res
      .status(401)
      .json({ error: true, message: 'El email o password son incorrectos' })
  }

  sessions.addToSession(user)

  res.status(201).json({ data: user, message: 'Sesión iniciada corectamente' })
})

/**
 * logout
 *
 * POST
 */
router.post('/logout', function (req, res) {
  const { id } = req.body

  const { activeSession } = hasSession('id', id)
  if (!activeSession) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con id: ${id} no tiene sesiones abiertas.` })
  }

  sessions.removeFromSession(id)

  return res
    .status(200)
    .json({ message: 'Sesión cerrada correctamente' })
})

/**
 * forget-password
 *
 * Cuando un usuario olvida una contraseña entonces manda un correo para la recuperación
 * de la misma, se genera internamente un token que se comparte al enlace cuando el usuario
 * recibe el correo de recuperación de contraseña, junto con su email.
 *
 * Ésto para hacer la validación de cambio de contraseña y saber a qué usuario corresponde.
 *
 * POST
 */
router.post('/forget-password', async (req, res) => {
  const { email } = req.body

  const { registered, index } = users.isRegister('email', email)
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con el email '${email}' no está registrado` })
  }

  //
  // Se manda un email para la recuperación de contraseña
  const { error, message } = await users.getUsers()[index].forgotPassword()

  return res
    .status(error ? 409 : 200)
    .json({ error, message })
})

/**
 * Reset password
 */
router.post('/reset-password', (req, res) => {
  const { token, email, password } = req.body

  const { registered, index } = users.isRegister('email', email)
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con el email ${email} no está registrado` })
  }

  const { error, message } = users.getUsers()[index].changePasswordUsingToken(token, password)

  return res
    .status(error ? 500 : 200)
    .json({ error, message })
})

module.exports = router
