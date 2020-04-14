const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Forgot Password')

const { subHours, format } = require('date-fns')
const Mail = use('Mail')
const Factory = use('Factory')
const Route = use('Route')
const Hash = use('Hash')
const Database = use('Database')

trait('Test/ApiClient')
trait('DatabaseTransactions')

beforeEach(() => {
  Mail.fake()
})

afterEach(() => {
  Mail.restore()
})

async function generateForgotPasswordToken(client, email) {
  const user = await Factory
    .model('App/Models/User')
    .create({ email })

  await client
    .post(Route.url('auth.forgot'))
    .send({ email })
    .end()

  const token = await user.tokens().first()

  return token
}

test('it should send an email with reset password instructions', async ({ assert, client }) => {
  const email = 'silver.yep@gmail.com'

  const user = await Factory
    .model('App/Models/User')
    .create({ email })

  await client
    .post(Route.url('auth.forgot'))
    .send({ email })
    .end()

  const token = await user.tokens().first()

  // Assert if a forgot password token was created for user
  assert.include(token.toJSON(), {
    type: 'forgotpassword'
  })

  const recentEmail = Mail.pullRecent()

  // Check if email was sent
  assert.equal(recentEmail.message.to[0].address, email)

  // Check if email body has the token
  assert.include(recentEmail.message.html, token.token)
})

test('it should be able to reset password', async ({ assert, client }) => {
  const email = 'silver.yep@gmail.com'

  const user = await Factory
    .model('App/Models/User')
    .create({ email })

  const { token } = await Factory
    .model('App/Models/Token')
    .create({
      user_id: user.id,
      type: 'forgotpassword',
      is_revoked: false
    })

  const response = await client
    .post(Route.url('auth.reset'))
    .send({
      token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end()

  response.assertStatus(204)

  await user.reload()
  const checkPassword = await Hash.verify('123456', user.password)

  assert.isTrue(checkPassword)
})

test('if cannot reset password after 2h of forgot password request', async ({ client }) => {
  const email = 'silver.yep@gmail.com'

  const user = await Factory
    .model('App/Models/User')
    .create({ email })

  const userToken = await Factory
    .model('App/Models/Token')
    .create({
      user_id: user.id,
      type: 'forgotpassword',
      is_revoked: false,
    })

  const dateFormated = format(subHours(new Date(), 3), 'yyyy-MM-dd HH:ii:ss')
  await Database
    .table('tokens')
    .where('token', userToken.token)
    .update('created_at', dateFormated)

  const response = await client
    .post(Route.url('auth.reset'))
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end()

  response.assertStatus(400)
})
