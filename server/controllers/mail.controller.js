const nodemailer = require('nodemailer');
const templates = require('../assets/email-template.js');

exports.sendConfirmationEmail = async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  const message = 'Potwierdz adres email';

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'book.activity@outlook.com', // sender address
    to: 'gregson0307@gmail.com', // list of receivers
    subject: 'Book Activity - Potwierdzenie rejestracji', // Subject line
    text: message,
    html: templates.HTML_TEMPLATE(message),
  });

  console.log('Message sent: %s', info.messageId);
  res.sendStatus(200);
};
