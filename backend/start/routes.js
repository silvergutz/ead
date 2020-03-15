'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('register', 'AuthController.register')
Route.post('authenticate', 'AuthController.authenticate')

Route.group(() => {

  Route.get('app', 'AppController.index')
  Route.get('download', 'UploadController.download').as('download')

  Route.resource('schools', 'SchoolController').apiOnly()
  Route.resource('users', 'UserController')
    .validator(new Map([
      [['users.store'], ['UserStore']],
      [['users.update'], ['UserUpdate']]
    ]))
    .apiOnly()
  Route.resource('modules', 'ModuleController').apiOnly()
  Route.resource('categories', 'CategoryController').apiOnly()
  Route.resource('courses', 'CourseController')
    .validator(new Map([
      [['courses.store'], ['CourseStore']],
      [['courses.update'], ['CourseUpdate']]
    ]))
    .apiOnly()
  Route.resource('lessons', 'LessonController')
    .validator(new Map([
      [['lessons.store'], ['LessonStore']],
      [['lessons.update'], ['LessonUpdate']]
    ]))
    .apiOnly()

}).middleware(['auth'])
