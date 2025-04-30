export function emailForgotPasswordTeamplate(link) {
  return {
    subject: 'Reset Password',
    html: `
                <h1>Reset Password</h1>
                <p>You recently requested a password reset for your account.</p>
                <p>The request is valid for one minute.</p>
                <p>Click on the link below to reset your password:</p>
                <a href="${link}">Reset Password</a>
                `,
  }
}
export function emailWelcomeTeamplate() {
  return {
    subject: 'Welcome to our website!',
    html: `
                <h1>Welcome to our website!</h1>
                <p>Thank you for signing up. You can now use your email and password to log in.</p>
                `,
  }
}
