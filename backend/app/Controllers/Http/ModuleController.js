'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Module = use('App/Models/Module')
const Course = use('App/Models/Course')

/**
 * Resourceful controller for interacting with modules
 */
class ModuleController {
  /**
   * Show a list of all modules.
   * GET modules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index ({ request }) {
    const { course } = request.get();

    const query = Module.query().with('lessons');

    if (course) {
      query.where('course_id', course);
    }

    const modules = await query.fetch();

    return modules;
  }

  /**
   * Create/save a new module.
   * POST modules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, response }) {
    const data = request.only(['name', 'slug', 'description', 'course_id'])

    const course = data.course_id ? await Course.find(data.course_id) : null
    if (!course) {
      response.status(400)
      return { error: 'Course not found' }
    }

    const moduleInstance = await Module.create(data)

    response.status(201)

    return moduleInstance
  }

  /**
   * Display a single module.
   * GET modules/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const moduleInstance = await Module.findOrFail(params.id)

    return moduleInstance
  }

  /**
   * Update module details.
   * PUT or PATCH modules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const moduleInstance = await Module.findOrFail(params.id)
    const data = request.only(['name', 'slug', 'description'])

    moduleInstance.merge(data)
    await moduleInstance.save()

    return moduleInstance
  }

  /**
   * Delete a module with id.
   * DELETE modules/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const moduleInstance = await Module.findOrFail(params.id)

    await moduleInstance.delete()
  }
}

module.exports = ModuleController
