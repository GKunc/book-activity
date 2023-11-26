const nodemailer = require('nodemailer');
const templates = require('../assets/email-template.js');
const db = require('../models');
const User = db.user;

exports.sendConfirmationEmail = async (req, res) => {
  const userId = req.userId;
  const confirmationSecret = req.confirmationSecret;

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
  const redirectURL = process.env.CONFRIMATION_URL + '?confirmationSecret=' + confirmationSecret + '&userId=' + userId;

  const user = await User.findOne({
    _id: userId,
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'book.activity@outlook.com', // sender address
    to: user.email, // list of receivers
    subject: 'Book Activity - Potwierdzenie rejestracji', // Subject line
    text: message,
    html: templates.HTML_TEMPLATE(redirectURL),
  });

  console.log('Message sent: %s', info.messageId);
};
