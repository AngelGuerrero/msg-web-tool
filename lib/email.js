const nodemailer = require('nodemailer')

const mailTo = async (content) => {
  let error, data, message

  const transporter = nodemailer.createTransport({
    service: process.env.NODE_EMAIL_SERVICE,
    host: process.env.NODE_EMAIL_HOST,
    port: process.env.NODE_EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.NODE_EMAIL_USER,
      pass: process.env.NODE_EMAIL_PASSWORD
    }
  })

  const callback = (err, info) => {
    error = err
    data = info
    message = error ? 'Something went wrong sending the email' : 'Email sent successfully'
  }

  await transporter.sendMail(content, callback)

  return { error, data, message }
}

module.exports.mailTo = mailTo
