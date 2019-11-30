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
        from: '"不才’ blog " <1450941858@qq.com>', // sender address
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
    async sendComment(email, name, pageName, pageLink, commentText, ) {
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"不才’ blog " <1450941858@qq.com>', // sender address
        to: email, // list of receivers
        subject: "不才‘blog 评论新回复", // Subject line
        text: "不才’blog 评论新回复", // plain text body
        html: `<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>不才blog</title>
      </head>
      
      <body>
        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0"
          style="min-width: 348px;background-color: #EEEEEE;">
          <tbody>
            <tr height="32px"></tr>
            <tr align="center">
              <td width="32px"></td>
              <td>
                <table border="0" cellspacing="0" cellpadding="0" style="max-width:600px">
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td align="left" style="font-size: 30px;color:#40C4FF;"><span>有新的回复</span></td>
                              <td align="right">
                                <img width="32" height="32" style="display:block;width: 45px;height: 45px;border-radius:50%;"
                                  alt="avatar" src="https://www.ixk.me/avatar-lite.png" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr height="16"></tr>
                    <tr>
                      <td>
                        <table bgcolor="#40C4FF" width="100%" border="0" cellspacing="0" cellpadding="0"
                          style="min-width:332px;max-width:600px;border:1px solid #e0e0e0;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px">
                          <tbody>
                            <tr>
                              <td height="50px" colspan="3"></td>
                            </tr>
                            <tr>
                              <td
                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:30px;color:#ffffff;line-height:1.25;text-align:center">
                                您的评论有新回复
                              </td>
                              <td width="32px"></td>
                            </tr>
                            <tr>
                              <td height="30px" colspan="3"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0"
                          style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px">
                          <tbody>
                            <tr height="16px">
                              <td width="32px" rowspan="3"></td>
                              <td></td>
                              <td width="32px" rowspan="3"></td>
                            </tr>
                            <tr>
                              <td>
                                <table style="min-width:300px" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td
                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5">
                                        尊敬的<span style="color:#40ceff;font-weight:bold">${name}</span>，您好！
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5">
                                        您在[不才 's blog]上《<a style="white-space:nowrap;color:#40ceff"
                                          href="${pageLink}"> ${pageName}</a>》
                                        一文的评论有新回复，欢迎您前来继续参与讨论。<br /><br />
                                        <span style="color:#40ceff;font-weight:bold">某用户</span>给您的回复如下
                                        <ol style="background:#e0e0e0;margin:5px;padding:20px 40px 20px">
                                          ${commentText}
                                        </ol>
                                      </td>
                                    </tr>
                                    <tr height="26px"></tr>
                                    <tr>
                                      <td
                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5">
                                        此致<br />不才 敬上
                                      </td>
                                    </tr>
                                    <tr height="20px"></tr>
                                    <tr>
                                      <td>
                                        <table
                                          style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:12px;color:#b9b9b9;line-height:1.5">
                                          <tbody>
                                            <tr>
                                              <td>
                                                此电子邮件地址无法接收回复。 </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr height="32px">
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr height="16"></tr>
                    <tr>
                      <td
                        style="max-width:600px;font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#bcbcbc;line-height:1.5">
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table
                          style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#666666;line-height:18px;padding-bottom:10px;width:100%;text-align:right;padding-right:10px">
                          <tbody>
                            <tr>
                              <td>
                                我们向您发送这封电子邮件通知，目的是让您了解本站相关的变化
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div style="direction: ltr;">
                                  &copy; Copyright 2019 <a style="white-space:nowrap;color:#40ceff"
                                    href="http://blog.ncgame.cc/">不才 's blog</a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td width="32px"></td>
            </tr>
            <tr height="32px"></tr>
          </tbody>
        </table>
        <br />
      </body>
      
      </html>` // html body
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