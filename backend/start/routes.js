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

const Helpers = use('Helpers')
const fs = use('fs')

// API Routes
// NOT protected routes
Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Welcome to API' }
  })

  // Route.post('register', 'AuthController.register')
  Route.post('authenticate', 'AuthController.authenticate')
}).prefix('/api/v1')

// protected routes
Route.group(() => {

  Route.get('app', 'AppController.index')
  Route.get('download', 'UploadController.download').as('download')

  Route.get('profile', 'ProfileController.show')
    .as('profile.show')
  Route.put('profile', 'ProfileController.update')
    .validator('ProfileUpdate')
    .as('profile.update')

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

}).middleware(['auth']).prefix('/api/v1')

// Frontend with React
Route.get('*', ({ request, response }) => {
  const path = request.url()
  if (path === '/' || !fs.existsSync(Helpers.publicPath(path))) {
    response.download(Helpers.publicPath('app.html'))
  } else {
    response.download(Helpers.publicPath(path));
  }
})

