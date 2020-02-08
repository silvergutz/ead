'use strict'

const Factory = use('Factory')
const Hash = use('Hash')

const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')

// trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

test('create a users', async ({ client }) => {
  const userToAuth = await User.find(1)


  User.availableLevels().map(async (level) => {
    [true, false].map(async (is_teacher) => {
      const user = await Factory
        .model('App/Models/User')
        .make()

      const userData = {
        name: user.name,
        email: user.email,
        school_id: user.school_id,
        is_teacher,
        photo: user.photo,
        level,
      }

      const response = await client
        .post('/users')
        .send({ password: 'secret', ...userData })
        .loginVia(userToAuth, 'jwt')
        .end()

      response.assertStatus(201)
      response.assertJSONSubset(userData)
    })
  })

})


test('get list of users', async ({ client }) => {
  const userToAuth = await User.find(1)

  const responseUnauthorized = await client
    .get('/users')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/users')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: userToAuth.name,
    email: userToAuth.email,
    photo: userToAuth.photo,
    school_id: userToAuth.school_id,
    level: userToAuth.level,
    is_teacher: userToAuth.is_teacher,
  }])
})

test('get a user', async ({ client }) => {
  const userToAuth = await User.find(1)

  const response = await client
    .get(`/users/1`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: userToAuth.name,
    email: userToAuth.email,
    photo: userToAuth.photo,
    school_id: userToAuth.school_id,
    level: userToAuth.level,
    is_teacher: userToAuth.is_teacher,
  })
})

test('update a user', async ({ client }) => {
  const userToAuth = await User.find(1)

  const school = await Factory.model('App/Models/School').create()
  const user = await Factory.model('App/Models/User').create()

  User.availableLevels().map(async (level) => {
    [true, false].map(async (is_teacher) => {
      const userData = {
        name: 'othername',
        email: 'other@email.com',
        school_id: school.id,
        is_teacher,
        photo: 'https://otherphoto.com/other.png',
        level,
      }

      const response = await client
        .put(`/users/${user.id}`)
        .send({ password: 'othersecret', ...userData })
        .loginVia(userToAuth, 'jwt')
        .end()

      response.assertStatus(200)
      response.assertJSONSubset(userData)
    })
  })
})

test('delete a user', async ({ client }) => {
  const userToAuth = await User.find(1)

  // assert not delete self user
  const responseNotAllowed = await client
    .delete(`/users/${userToAuth.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  responseNotAllowed.assertStatus(401)
  responseNotAllowed.assertJSONSubset({
    error: 'You can\'t delete yourself'
  })


  const response = await client
    .delete('/users/2')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
