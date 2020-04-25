'use strict'

const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { parseISO, isBefore, subHours } = require('date-fns')
const Config = use('Config')
const Mail = use('Mail')
const Env = use('Env')

const User = use('App/Models/User')
const Token = use('App/Models/Token')

class AuthController {

  async register({ request }) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async authenticate({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)
    const user = await User.findBy('email', email)

    return { ...(user.toJSON()), ...token }
  }

  async forgot({ request }) {
    const email = request.input('email')

    // Find user owner of email
    const user = await User.findByOrFail('email', email)

    // Revoke previously forgot password requests
    await user
      .tokens()
      .where('type', 'forgotpassword')
      .update({ is_revoked: 1 })

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')

    await user
      .tokens()
      .create({ token, type: 'forgotpassword' })

    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset/${token}`

    const data = {
      user,
      resetPasswordUrl,
      appName: Config.get('app.name'),
    }

    await Mail.send('emails.forgotpassword', data, (message) => {
      message
      .to(user.email)
      .from(Env.get('MAIL_FROM'))
      .subject('Recuperação de Senha - ' + Config.get('app.name'))
    })
  }

  async reset({ request, response }) {
    const { token, password } = request.only([ 'token', 'password' ])

    const userToken = await Token.findByOrFail('token', token)

    // Not allow change password if token has more than 2h
    if (userToken.is_revoked || isBefore(userToken.created_at, subHours(new Date(), 2))) {
      userToken.is_revoked = true
      await userToken.save()
      return response.status(400).json({ error: 'Token Expired' })
    }

    const user = await userToken.user().fetch()

    user.password = password

    // save password change
    await user.save()

    // revoke token
    userToken.is_revoked = true
    await userToken.save()
  }
}

module.exports = AuthController
