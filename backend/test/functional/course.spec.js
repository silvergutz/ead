'use strict'

const Factory = use('Factory')
const Helpers = use('Helpers')

const { test, trait } = use('Test/Suite')('Course')

const Course = use('App/Models/Course')
const User = use('App/Models/User')
const School = use('App/Models/School')
const Category = use('App/Models/Category')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a course', async ({ client }) => {
  const userToAuth = await User.first()

  const categories = await Category
    .query()
    .limit(3)
    .pluck('id')

  const teachers = await User
    .query()
    .where('is_teacher', true)
    .limit(3)
    .pluck('id')

  const course = await Factory.model('App/Models/Course').make()
  const courseData = {
    name: course.name,
    description: course.description,
    school_id: course.school_id,
    status: course.status,
  }

  const response = await client
    .post('/courses')
    .field('name', courseData.name)
    .field('description', courseData.description)
    .field('school_id', courseData.school_id)
    .field('status', courseData.status)
    .field('categories[]', categories)
    .field('teachers[]', teachers)
    .attach('cover', `${Helpers.appRoot()}/test/data/images/fake.jpeg`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(201)

  response.assertJSONSubset(courseData)
})


test('get list of courses', async ({ client }) => {
  const userToAuth = await User.first()
  const course = await Course.first()

  const responseUnauthorized = await client
    .get('/courses')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/courses')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: course.name,
    description: course.description,
    cover: course.cover,
    school_id: course.school_id,
    status: course.status,
  }])
})

test('get a course', async ({ client }) => {
  const userToAuth = await User.first()

  const course = await Factory.model('App/Models/Course').create()
  const categories = await Category
    .query()
    .limit(3)
    .fetch()

  await course.categories().attach(categories.rows.map((c) => c.id))
  let cats = await course.categories().fetch()

  const response = await client
    .get(`/courses/${course.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({...course.toJSON()})
})

test('update a course sending cover', async ({ client }) => {
  const userToAuth = await User.first()
  const course = await Course.first()

  const categories = await Category
    .query()
    .limit(2)
    .pluck('id')

  const teachers = await User
    .query()
    .where('is_teacher', true)
    .limit(2)
    .pluck('id')

  const response = await client
    .put(`/courses/${course.id}`)
    .field('categories[]', categories)
    .field('teachers[]', teachers)
    .attach('cover', `${Helpers.appRoot()}/test/data/images/fake2.jpg`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
})

test('update a course not sending cover', async ({ client }) => {
  const userToAuth = await User.first()
  const course = await Course.first()

  const categories = await Category
    .query()
    .limit(3)
    .pluck('id')

  const teachers = await User
    .query()
    .where('is_teacher', true)
    .limit(3)
    .pluck('id')

  const updatedCourseData = {
    name: 'updated name',
    description: 'updated desc',
    status: 'published',
  }

  const response = await client
    .put(`/courses/${course.id}`)
    .send({ categories, teachers, ...updatedCourseData })
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(updatedCourseData)
})

test('delete a course', async ({ client }) => {
  const userToAuth = await User.first()
  const course = await Factory.model('App/Models/Course').create()

  const response = await client
    .delete(`/courses/${course.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
