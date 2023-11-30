const MailService = require('../services/mail.service');
const templates = require('../assets/email-template');

exports.sendConfirmationEmail = async (req, res) => {
  const result = await MailService.senndMail(
    req.body.mailTo,
    req.body.mailTitle,
    req.body.mailContent,
    templates.HTML_TEMPLATE()
  );
  console.log('Message sent: %s', result.messageId);
};
