'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const Drive = use('Drive')

const CourseService = use('App/Services/CourseService')
const Course = use('App/Models/Course')
const School = use('App/Models/School')
const Category = use('App/Models/Category')
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
  async index () {
    const courses = await Course.query()
      .with('categories')
      .with('teachers')
      .with('lessons')
      .fetch();

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
    const { categories, teachers } = request.all()
    const data = {
      courseData: request.only(['name', 'description', 'school_id', 'status']),
      coverFile: request.file('cover', coverRules),
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
  async show ({ params, response }) {
    const course = await Course
      .query()
      .with('modules')
      .with('modules.lessons')
      .limit(1)
      .where('id', params.id)
      .fetch()

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
    const { categories, teachers } = request.all()
    const data = {
      courseData: request.only(['name', 'description', 'status']),
      coverFile: request.file('cover', coverRules),
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
