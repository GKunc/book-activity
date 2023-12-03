const nodemailer = require('nodemailer');
const templates = require('../assets/email-template');

async function sendMail(mailTo, title, message, template) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  return transporter.sendMail({
    from: 'book.activity@outlook.com', // sender address
    to: mailTo, // list of receivers
    subject: title, // Subject line
    text: message,
    html: templates.HTML_TEMPLATE(),
  });
}

const MailService = {
  sendMail,
};

module.exports = MailService;
