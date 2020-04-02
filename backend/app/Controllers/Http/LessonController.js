'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Lesson = use('App/Models/Lesson')
const User = use('App/Models/User')
const LessonService = use('App/Services/LessonService')

/**
 * Resourceful controller for interacting with lessons
 */
class LessonController {
  /**
   * Show a list of all lessons.
   * GET lessons
   *
   * @param {object} ctx
   */
  async index () {
    const lessons = await Lesson.all();

    return lessons;
  }

  /**
   * Create/save a new lesson.
   * POST lessons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['name', 'description', 'video', 'duration', 'module_id', 'order', 'status'])

    const lesson = await LessonService.save(data)

    response.status(201)

    return lesson
  }

  /**
   * Display a single lesson.
   * GET lessons/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const lesson = await Lesson.findOrFail(params.id)

    return lesson
  }

  /**
   * Update lesson details.
   * PUT or PATCH lessons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let data = request.only(['name', 'description', 'video', 'duration', 'module_id', 'order', 'status'])

    data.id = params.id
    const lesson = await LessonService.save(data)

    return lesson
  }

  /**
   * Delete a lesson with id.
   * DELETE lessons/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const lesson = await Lesson.findOrFail(params.id)

    await lesson.delete()
  }

  /**
   * Store lesson action made by user.
   * POST lessons/:id/action
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Parameters} ctx.params
   */
  async action ({ request, response, params, auth }) {
    const lesson = await Lesson.findOrFail(params.id)
    const { action } = request.only(['action']);

    const result = await LessonService.storeAction(lesson.id, auth.user.id, action)

    if (result.action == action) {
      response.status(201)
    }

    return result
  }

  /**
   * Display how much user progressed with some lesson, can be (open, start, done)
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

    const lesson = await Lesson.findOrFail(params.id)
    const user = await User.findOrFail(params.user)

    const action = await LessonService.getProgress(lesson, user)
    return {
      action: action || 'nothing'
    }
  }
}

module.exports = LessonController
