'use strict'

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Lesson')

const Course = use('App/Models/Course')
const Lesson = use('App/Models/Lesson')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a lesson', async ({ client }) => {
  const userToAuth = await User.first()

  const lesson = await Factory.model('App/Models/Lesson').make()

  let lessonData = {
    name: lesson.name,
    description: lesson.description,
    video: lesson.video,
    duration: lesson.duration,
    order: lesson.order,
    status: lesson.status,
  }

  // Module not found
  const responseError = await client
    .post('/lessons')
    .send({ module_id: 999, ...lessonData })
    .loginVia(userToAuth, 'jwt')
    .end()

  responseError.assertStatus(400)
  responseError.assertJSONSubset({ error: 'Module not found' })

  // Insertion OK
  lessonData.module_id = lesson.module_id
  const response = await client
    .post('/lessons')
    .send(lessonData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset(lessonData)
})

test('get list of lessons', async ({ client }) => {
  const userToAuth = await User.first()
  const lesson = await Lesson.first()

  const responseUnauthorized = await client
    .get('/lessons')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/lessons')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: lesson.name,
    description: lesson.description,
    video: lesson.video,
    duration: lesson.duration,
    module_id: lesson.module_id,
    order: lesson.order,
    status: lesson.status,
  }])
})

test('get a lesson', async ({ client }) => {
  const userToAuth = await User.first()

  const lesson = await Lesson.first()

  const response = await client
    .get(`/lessons/${lesson.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: lesson.name,
    description: lesson.description,
    video: lesson.video,
    duration: lesson.duration,
    module_id: lesson.module_id,
    order: lesson.order,
    status: lesson.status,
  })
})

test('update a lesson', async ({ client }) => {
  const userToAuth = await User.first()
  const lesson = await Lesson.first()

  const newLessonData = {
    name: 'updated name',
    description: 'updated description',
    video: 'https://youtube.com/XYZ',
    duration: '00:10:05',
    order: 1,
    status: Lesson.STATUS_PUBLISHED,
  }

  const response = await client
    .put(`/lessons/${lesson.id}`)
    .send(newLessonData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(newLessonData)
})

test('delete a lesson', async ({ client }) => {
  const userToAuth = await User.first()
  const lesson = await Factory.model('App/Models/Lesson').create()

  const response = await client
    .delete(`/lessons/${lesson.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
