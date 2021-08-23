/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
/* eslint-disable func-call-spacing */
const _ = require('lodash')
const { Router } = require('express')
const router = Router()
const users = require('../models/users')

/**
 * Actualiza un usuario registrado
 *
 * POST
 */
router.put('/:id', function (req, res) {
  const id = _.toInteger(req.params.id)

  const { nombre, email, direccion, ciudad, estado, pais, telefono, usar_informacion } = req.body

  if (
    !nombre
    || !email
    // || !direccion
    // || !ciudad
    // || !estado
    // || !pais
    || !telefono
    // || !usar_informacion
  ) {
    return res
      .status(422)
      .json({ error: true, message: 'Los datos son requeridos' })
  }

  const { registered, index } = users.isRegister('id', id)
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con el id '${id}' no está registrado` })
  }

  const { item, message } = users.getUsers()[index].setUser(nombre, email, direccion, ciudad, estado, telefono, pais, usar_informacion)

  return res
    .status(200)
    .json({ data: item, message })
})

/**
 * Actualiza la contraseña de un usuario
 *
 * PUT
 */
router.put('/:id/password', function (req, res) {
  const id = _.toInteger(req.params.id)

  const { old_password, password } = req.body

  const { registered, index } = users.isRegister('id', id)
  if (!registered) {
    return res
      .status(404)
      .json({ error: true, message: `El usuario con el id '${id}' no está registrado` })
  }

  const match = users.getUsers()[index].matchPassword(old_password)
  if (!match) {
    return res
      .status(422)
      .json({ error: true, message: 'La contraseña ingresada no coincide con la contraseña actual' })
  }

  const { error, message } = users.getUsers()[index].setPassword(password)

  return res
    .status(200)
    .json({ error, message })
})

module.exports = router
