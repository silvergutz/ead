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
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, auth }) {
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

    const course = await query.fetch()

    if (!course.rows.length) {
      response.status(404)
      return { error: 'Not found' }
    }

    return course.first()
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
}

module.exports = CourseController
