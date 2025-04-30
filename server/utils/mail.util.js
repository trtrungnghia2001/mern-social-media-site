import ENV_CONFIG from '#server/configs/env.config'
import { emailForgotPasswordTeamplate } from '#server/helpers/teamplate.helper'
import transporter from '#server/configs/nodemailer.config'

export function sendMailForgotPassword({ to, link }) {
  const message = emailForgotPasswordTeamplate(link)

  var mailOptions = {
    from: ENV_CONFIG.EMAIL.USER,
    to: to,
    subject: message.subject,
    html: message.html,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
