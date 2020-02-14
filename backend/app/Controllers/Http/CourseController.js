'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Course = use('App/Models/Course')
const School = use('App/Models/School')
const Category = use('App/Models/Category')
const User = use('App/Models/User')

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
    const data = request.only(['name', 'description', 'cover', 'school_id', 'status'])
    let { categories, teachers } = request.all()

    const school = data.school_id ? await School.find(data.school_id) : null
    if (!school) {
      response.status(400)
      return { error: 'School not found' }
    }

    const course = await Course.create(data)

    // Categories
    categories = await Category
      .query()
      .whereIn('id', categories)
      .pluck('id')
    await course.categories().attach(categories)

    // Teachers
    teachers = await User
      .query()
      .whereIn('id', teachers)
      .pluck('id')
    await course.teachers().attach(teachers)

    response.status(201)

    return course
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
  async update ({ params, request, response }) {
    const course = await Course.findOrFail(params.id)

    const data = request.only(['name', 'description', 'cover', 'school_id', 'status'])
    let { categories, teachers } = request.all()

    if (data.school_id) {
      const school = await School.find(data.school_id)
      if (!school) {
        response.status(400)
        return { error: 'School not found' }
      }
    }

    // Categories
    if (categories !== undefined) {
      if (categories.length) {
        categories = await Category
          .query()
          .whereIn('id', categories)
          .pluck('id')
      }
      course.categories().sync(categories)
    }

    // Teachers
    if (teachers !== undefined) {
      if (teachers.length) {
        teachers = await User
          .query()
          .whereIn('id', teachers)
          .pluck('id')
      }
      course.teachers().sync(teachers)
    }

    course.merge(data)
    await course.save()

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
