const nodemailer = require('nodemailer');
const templates = require('../assets/email-template.js');

exports.sendConfirmationEmail = async (req) => {
  const userId = req.userId;
  const confirmationSecret = req.confirmationSecret;

  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASSWORD);

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

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'book.activity@outlook.com', // sender address
    to: 'gregson0307@gmail.com', // list of receivers
    subject: 'Book Activity - Potwierdzenie rejestracji', // Subject line
    text: message,
    html: templates.HTML_TEMPLATE(redirectURL),
  });

  console.log('Message sent: %s', info.messageId);
};
