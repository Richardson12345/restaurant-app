let send = function (email, user) {


    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sdpusparani.sd@gmail.com',
        pass: '******'
      }
    });
  
  
    const mailOptions = {
      from: 'sdpusparani.sd@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Welcome to the good Apps ', // Subject line
      html: '<p>Hi ' + user + ', welcome to the Good Apps!.  Enjoy our apps and listening all musics </p>' // plain text body
    };
  
  
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  
  
  
  }
  
  
  module.exports = send