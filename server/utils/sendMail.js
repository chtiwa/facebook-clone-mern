const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASS
  }
});

// send mail with defined transport object
const sendEmail = async (options) => {
  let info = await transporter.sendMail({
    from: process.env.OUTLOOK_EMAIL, // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: options.html // html body
  })
  // console.log(info.accepted)
}

module.exports = sendEmail