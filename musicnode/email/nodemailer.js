const nodemailer = require('nodemailer');

let nodeMail = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 25,
  secure: false,
  auth: {
    user: 'qxzfckyou@163.com',
    pass: 'CFurnZzwZb2AwGZU'
  }
})

module.exports = nodeMail;