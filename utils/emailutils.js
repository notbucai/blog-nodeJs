const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

// async..await is not allowed in global scope, must use a wrapper
module.exports = function () {
  // { user, pass }, { host = "smtp.qq.com", port = 587 }

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = {
    ...mailConfig.account
  }

  let { host, port } = mailConfig.server;
  

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  return {
    async sendCode(email, code) {
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"不才’ blog " <bucai_o@qq.com>', // sender address
        to: email, // list of receivers
        subject: "不才‘blog 验证码", // Subject line
        text: "不才’blog 验证码", // plain text body
        html: `<h1>不才‘blog </h1>您本次 验证码<b>${code}</b> 如非本人操作，请忽略。有效时间5分钟。 <p>来源<a href="http://www.ncgame.cc/">不才‘blog</a></p>` // html body
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions)

      console.log("Message sent: %s", JSON.stringify(info));
      // Preview only available when sending through an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return info.response && info.response.indexOf("Ok") > 0;
    },
    sendMail: transporter.sendMail
  }


  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

// module.exports().sendCode("1450941858@qq.com",123433);