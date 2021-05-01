var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  port  : 25,
  auth: {
    user: 'mathewsmathai1@gmail.com',
    pass: 'yusbwwlfcyzbliqf'
  }
});

var mailOptions = {
  from: 'mathewsmathai1@gmail.com',
  to: 'mathewsmathai1@gmail.com',
  subject: 'SUBJECT 1',
  text: 'Sending'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});