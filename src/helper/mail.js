import nodemailer from'nodemailer';
import configModel from'../modules/config/model.js';
import db from'../config/koneksi.js';
import { QueryTypes } from'sequelize';

  
 
  
  function sendMail(to, subject, html) {

    return new Promise(async (resolve, reject) => {
      let dt = await db.query("select * from config where id='60d9c4ad-d770-4999-9468-a7953fbc42xx'",{type: QueryTypes.SELECT});
     
     let config = {
      host: dt[0].mail_host,
      port: dt[0].mail_port,
      secure: dt[0].mail_secure,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: dt[0].mail_user,
        pass: dt[0].mail_password
      },
      tls: {
        ciphers:'SSLv3'
    }

    }
    
      const transporter = nodemailer.createTransport(config);
      const mailOptions = {
        from: `NoReply<${dt[0].mail_from}>`,
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