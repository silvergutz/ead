'use strict'

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Module')

const Course = use('App/Models/Course')
const Module = use('App/Models/Module')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a module', async ({ client }) => {
  const userToAuth = await User.first()

  const model = await Factory.model('App/Models/Module').make()

  const moduleData = {
    name: model.name,
    description: model.description,
  }

  // Course not found
  const responseError = await client
    .post('/modules')
    .send({ course_id: 999, ...moduleData })
    .loginVia(userToAuth, 'jwt')
    .end()
  responseError.assertStatus(400)
  responseError.assertJSONSubset({ error: 'Course not found' })

  // Correct insertion
  moduleData.course_id = model.course_id
  const response = await client
    .post('/modules')
    .send(moduleData)
    .loginVia(userToAuth, 'jwt')
    .end()
  response.assertStatus(201)
  response.assertJSONSubset(moduleData)
})


test('get list of modules', async ({ client }) => {
  const userToAuth = await User.first()
  const model = await Module.first()

  const responseUnauthorized = await client
    .get('/modules')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/modules')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: model.name,
    slug: model.slug,
    description: model.description,
    course_id: model.course_id
  }])
})

test('get a module', async ({ client }) => {
  const userToAuth = await User.first()

  const model = await Module.first()

  const response = await client
    .get('/modules/1')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: model.name,
    slug: model.slug,
    description: model.description,
    course_id: model.course_id
  })
})

test('update a module', async ({ client }) => {
  const userToAuth = await User.first()
  const model = await Module.first()

  const newModuleData = {
    name: 'updated name',
    description: 'updated description',
  }

  const response = await client
    .put(`/modules/${model.id}`)
    .send(newModuleData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(newModuleData)
})

test('delete a module', async ({ client }) => {
  const userToAuth = await User.first()
  const model = await Factory.model('App/Models/Module').create()

  const response = await client
    .delete(`/modules/${model.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
