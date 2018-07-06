let send = function (email) {


    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chuddywarrior@gmail.com',
        pass: '11121314151'
      }
    });
  
  
    const mailOptions = {
      from: 'chuddywarrior@gmail.com', // sender address
      to: email,  // list of receivers
      subject: 'Welcome to Food Ordering Apps ', // Subject line
      html: '<p>Hi welcome to the food apps!.  now you can order food in the convenince of your home </p>' // plain text body
    };
  
  
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  
  
  
  }
  
  
  module.exports = send