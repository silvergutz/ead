'use strict'

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('School')

const User = use('App/Models/User')
const School = use('App/Models/School')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a school', async ({ client }) => {
  const userToAuth = await User.first()

  const school = await Factory.model('App/Models/School').make()

  const schoolData = {
    name: school.name
  }

  const response = await client
    .post('/schools')
    .send(schoolData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(201)

  response.assertJSONSubset(schoolData)
})


test('get list of schools', async ({ client }) => {
  const userToAuth = await User.first()
  const school = await School.first()

  const responseUnauthorized = await client
    .get('/schools')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/schools')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: school.name,
  }])
})

test('get a school', async ({ client }) => {
  const userToAuth = await User.first()

  const school = await School.first()

  const response = await client
    .get('/schools/1')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: school.name,
  })
})

test('update a school', async ({ client }) => {
  const userToAuth = await User.first()
  const school = await School.first()
  const newSchoolData = {
    name: 'updated name',
  }

  const response = await client
    .put(`/schools/${school.id}`)
    .send(newSchoolData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(newSchoolData)
})

test('delete a school', async ({ client }) => {
  const userToAuth = await User.first()
  const school = await Factory.model('App/Models/School').create()

  const response = await client
    .delete(`/schools/${school.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
