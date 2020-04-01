'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const CourseService = use('App/Services/CourseService')
const Course = use('App/Models/Course')
const Lesson = use('App/Models/Lesson')
const User = use('App/Models/User')

const coverRules = {
  types: ['image'],
  size: '2mb',
  extnames: ['jpg','jpeg','png'],
}

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {

  /**
   * Check if a current user has permission to se the progress of other
   *
   * @param integer currentUser Current User id
   * @param integer target      Target User id
   * @return boolean
   */
  _canUserSeeProgress(currentUser, target) {
    // Students are not allowed to view progress of other users
    if (currentUser.level !== User.LEVEL_STUDENT || target === currentUser.id) {
      return true;
    }

    return false;
  }

  /**
   * Show a list of all courses.
   * GET courses
   *
   * @param {object} ctx
   */
  async index ({ request, auth }) {
    const { s } = request.get();

    const query = Course.query()
      .with('schools')
      .with('categories')
      .with('teachers')
      .with('lessons')
      .orderBy('created_at', 'desc')

    // Filter by search term
    if (s) {
      const searchTerm = '%' + s.replace(/\s/g, '%') + '%'
      query.where('name', 'like', searchTerm)
    }

    // For students show only published
    if (auth.user.level === User.LEVEL_STUDENT) {
      query.where('status', Course.STATUS_PUBLISHED)
    }

    const courses = await query.fetch();

    return courses;
  }

  /**
   * Create/save a new course.
   * POST courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { schools, categories, teachers } = request.all()
    const data = {
      courseData: request.only(['name', 'description', 'school_id', 'status']),
      coverFile: request.file('cover', coverRules),
      schools,
      categories,
      teachers,
    }

    const result = await CourseService.save(data)

    if (result.error) {
      response.status(400)
      return result
    }

    response.status(201)

    return result
  }

  /**
   * Display a single course.
   * GET courses/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const { progress } = request.get()

    const query = Course
      .query()
      .with('schools')
      .with('categories')
      .with('teachers')
      .with('modules')
      .limit(1)
      .where('id', params.id)


    // For students show only published
    if (auth.user.level === User.LEVEL_STUDENT) {
      query
        .with('modules.lessons', (builder) => {
          builder.where('status', Lesson.STATUS_PUBLISHED)
        })
    } else {
      query.with('modules.lessons')
    }

    // Lessons history
    if (progress) {
      // Check permission
      if (this._canUserSeeProgress(auth.user, progress)) {
        query.with('modules.lessons.history', (builder) => {
          builder.where('user_id', progress)
        })
      }
    }

    let course = await query.fetch()

    if (!course.rows.length) {
      response.status(404)
      return { error: 'Not found' }
    }

    course = course.first()

    // Calculate total Course progress
    if (progress && this._canUserSeeProgress(auth.user, progress)) {
      course.progress = await CourseService.getProgress(course, progress)
    }

    return course
  }

  /**
   * Update course details.
   * PUT or PATCH courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ request, params }) {
    const { schools, categories, teachers } = request.all()
    const data = {
      courseData: request.only(['name', 'description', 'status']),
      coverFile: request.file('cover', coverRules),
      removeCover: request.input('remove_cover', false),
      schools,
      categories,
      teachers,
    }

    data.courseData.id = parseInt(params.id)

    const course = await CourseService.save(data)

    return course
  }

  /**
   * Delete a course with id.
   * DELETE courses/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const course = await Course.findOrFail(params.id)

    await course.delete()
  }

  /**
   * Display the percentage of lessons of a course that some user was done
   * GET courses/:id/progress/:user
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async progress ({ params, response, auth }) {
    // Students are not allowed to view progress of other users
    if (auth.user.level === User.LEVEL_STUDENT && params.user !== auth.user.id) {
      response.status(403)
      return { error: 'forbidden' }
    }

    const course = await Course.findOrFail(params.id)
    const user = await User.findOrFail(params.user)

    const progress = await CourseService.getProgress(course, user.id)

    return {
      progress
    }
  }
}

module.exports = CourseController
