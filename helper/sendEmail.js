function sendEmail(project, deadline, cb){
  const nodemailer = require('nodemailer')
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'testemailajah@gmail.com',
          pass: 'testemail12345'
      }
  });
  let tanggal = deadline.getDate() +' - ' + deadline.getMonth()+' - '+deadline.getFullYear();
  // console.log(tanggal)
  let mailOptions = {
      from: 'testemaiajah@gmail.com',
      to: 'albiardtya@gmail.com, vbagustinus@gmail.com',
      subject: 'Deadline',
      text: `${project} segera berakhir 2 hari lagi tepatnya pada ${tanggal}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Waduh', error.message);
      }
      cb('Message Sent!')

  });
}
module.exports = sendEmail;
