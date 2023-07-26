import nodemailer from'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS
    }
  });
  
 
  
  function sendMail(to, subject, html) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: 'NoReply<tump.store@gmail.com>',
        to,
        subject,
        html
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       
       reject(error)
        } else {
          console.log('Email sent: ' + info.response);
          resolve()
          // do something useful
        }
      });
    })
    
  }
  
  export default sendMail;