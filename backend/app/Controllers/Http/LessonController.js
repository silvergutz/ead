'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Lesson = use('App/Models/Lesson')
const Module = use('App/Models/Module')

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

    const moduleModel = data.module_id ? await Module.find(data.module_id) : null
    if (!moduleModel) {
      response.status(400)
      return { error: 'Module not found' }
    }

    const lesson = await Lesson.create(data)

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
    const lesson = await Lesson.findOrFail(params.id)
    const data = request.only(['name', 'description', 'video', 'duration', 'module_id', 'order', 'status'])

    if (data.module_id) {
      const moduleModel = await Module.find(data.module_id)
      if (!moduleModel) {
        response.status(400)
        return { error: 'Module not found' }
      }
    }

    lesson.merge(data)
    await lesson.save()

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
}

module.exports = LessonController
