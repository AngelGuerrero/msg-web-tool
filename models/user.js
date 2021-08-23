const faker = require('faker')
const { mailTo } = require('../lib/email')

const User = function (id, nombre, email, password) {
  this.id = id
  this.nombre = nombre
  this.email = email
  this.direccion = ''
  this.ciudad = ''
  this.estado = ''
  this.telefono = ''
  this.pais = ''
  this.usar_informacion = true

  this.password = password

  this.requestedRecoverPassword = false
  this.recoverPasswordToken = null
}

const UserFactory = function () {
  this.createUser = function (id, nombre, email, password) {
    const user = new User(id, nombre, email, password)

    user.getUser = function () {
      return {
        id: this.id,
        nombre: this.nombre,
        email: this.email,
        direccion: this.direccion,
        ciudad: this.ciudad,
        estado: this.estado,
        telefono: this.telefono,
        pais: this.pais,
        usar_informacion: this.usar_informacion
      }
    }

    user.setUser = function (nombre, email, direccion, ciudad, estado, telefono, pais, usarInformacion) {
      this.nombre = nombre
      this.email = email
      this.direccion = direccion
      this.ciudad = ciudad
      this.estado = estado
      this.telefono = telefono
      this.pais = pais
      this.usar_informacion = usarInformacion

      return { item: this.getUser(), message: `Usuario '${this.nombre}' actualizado correctamente` }
    }

    user.matchPassword = function (password) {
      return this.password === password
    }

    user.setPassword = function (password) {
      this.password = password
      return { error: false, message: 'Password updated successfully' }
    }

    user.changePasswordUsingToken = function (token, password) {
      if (!this.requestedRecoverPassword) {
        return { error: true, message: 'El token para el cambio de contraseña ha expirado' }
      }

      if (token !== this.recoverPasswordToken) {
        return { error: true, message: 'El token ingresado es incorrecto' }
      }

      this.password = password
      this.requestedRecoverPassword = false
      this.recoverPasswordToken = null

      return { message: 'Cambio de contraseña satisfactoriamente' }
    }

    user.forgotPassword = async function () {
      if (this.requestedRecoverPassword) {
        return { error: true, message: 'Ya envió un correo para restablecer la contraseña' }
      }

      this.recoverPasswordToken = generateToken()

      this.requestedRecoverPassword = true

      await sendMailToRecoverPassword(this.recoverPasswordToken, this.email)

      return { message: 'Email enviado para restablecimiento de contraseña' }
    }

    async function sendMailToRecoverPassword (token, email) {
      const resetURL = process.env.EMAIL_RESET_PASSWORD_URL || ''
      const url = `${resetURL}?token=${token}&email=${email}`

      await mailTo({
        from: "'RECUPERACIÓN DE CONTRASEÑA MWT-UI' <mwt@support.com>",
        to: email,
        subject: 'Notificación de restablecimiento de contraseña',
        text: 'Has recibido este correo porque has solicitado restablecer tu contraseña.',
        html: /* html */`
        <style>
          .wrapper {
            min-width: 100%;
            padding: 4rem 1rem;
            background-color: rgb(249, 252, 255);
          }
          .container {
            max-width: 50rem;
            margin: 0 auto;
            border: 1px solid lightgray;
            padding: 2rem;
            background-color: white;
          }
          .text__title {
            text-align: center;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: clamp(1rem, calc(1rem + 100vw), 1.5rem);
            color: rgb(111, 115, 116);
            text-transform: uppercase;
          }
          .text__body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: clamp(0.7rem, calc(1rem + 100vw), 1rem);
            color: rgb(51, 51, 104);
          }
          .btn {
            border: none;
            padding: 0.6rem;
            margin: 0 auto;
            background-color: black;
            color: white;
            border-radius: 3px;
            cursor: pointer;
          }
          .btn:hover {
            background-color: rgb(33, 33, 116);
          }
          .text__footer {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: clamp(0.6rem, calc(1rem + 100vw), 0.8rem);
            color: rgb(107, 101, 106);
          }
        </style>
        <div class="wrapper">
          <div class="container">
            <header>
              <h1 class="text__title">Sistema web de mensajería</h1>
            </header>
            <p class="text__body">
              Has recibido este correo porque recibimos una solicitud de
              restablecimiento de contraseña.
            </p>
            <a href='${url}' target="_blank" class="url__link">
              <button class="btn">Restablecer contraseña</button>
            </a>
            <p class="text__body">
              Si no solicitó un restablecimiento de contraseña, no es necesario
              realizar ninguna otra acción.
            </p>
            <p class="text__footer">
              Si tiene problemas con el botón, favor de copiar y pegar en otra
              pestaña el siguiente enlace.
            </p>
            <a href='${url}' target="_blank" class="url__link"> ${url} </a>
          </div>
        </div>
    `
      })
    }

    function generateToken () {
      return faker.git.commitSha()
    }

    return user
  }
}

module.exports.UserFactory = UserFactory
