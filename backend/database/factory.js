'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Hash = use('Hash')

const School = use('App/Models/School')
const User = use('App/Models/User')
const Category = use('App/Models/Category')
const Course = use('App/Models/Course')
const Module = use('App/Models/Module')
const Lesson = use('App/Models/Lesson')

Factory.blueprint('App/Models/School', async (faker) => {
  return {
    name: faker.company(),
  }
})

Factory.blueprint('App/Models/User', async (faker) => {
  const [ id ] = await School.query().limit(1).pluck('id')

  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.password(),
    photo: faker.avatar(),
    school_id: id,
    level: faker.shuffle(User.availableLevels())[0],
    is_teacher: faker.bool()
  }
})

Factory.blueprint('App/Models/Category', async (faker) => {
  return {
    name: faker.profession(),
    description: faker.paragraph({ sentences: 2 }),
  }
})

Factory.blueprint('App/Models/Course', async (faker) => {
  const [ id ] = await School
    .query()
    .orderByRaw('RAND(id)')
    .limit(1)
    .pluck('id')

  return {
    name: faker.name(),
    description: faker.paragraph({ sentences: 1 }),
    cover: faker.avatar({ protocol: 'https' }),
    status: faker.shuffle(Course.availableStatus())[0],
  }
})

Factory.blueprint('App/Models/Module', async (faker) => {
  const courseId = await Course
    .query()
    .select('id')
    .orderByRaw('RAND(id)')
    .first()

  return {
    name: faker.name(),
    description: faker.paragraph({ sentences: 1 }),
    course_id: courseId.id
  }
})

Factory.blueprint('App/Models/Lesson', async (faker) => {
  const [ module_id ] = await Course.query().limit(1).orderByRaw('RAND(id)').pluck('id')

  const h = '0' + faker.integer({ min: 0, max: 3 })
  const m = faker.minute()
  const s = faker.second()
  const duration =
    h + ':' +
    (m < 10 ? '0' + m : m) + ':' +
    (s < 10 ? '0' + s : s)

  return {
    name: faker.name(),
    description: faker.paragraph({ sentences: 2 }),
    video: 'https://vimeo.com/' + faker.integer({ min: 111111111, max: 199999999 }),
    duration,
    module_id,
    order: faker.integer({ min: 1, max: 20 }),
    status: faker.shuffle(Lesson.availableStatus())[0],
  }
})

Factory.blueprint('App/Models/Student', async (faker) => {
  const user = await Factory.model('App/Models/User').create()

  return {
    name: faker.name(),
    user_id: user.id
  }
})
