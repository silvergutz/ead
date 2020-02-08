'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const School = use('App/Models/School')

/**
 * Resourceful controller for interacting with schools
 */
class SchoolController {
  /**
   * Show a list of all schools.
   * GET schools
   *
   * @param {object} ctx
   */
  async index () {
    const schools = await School.all();

    return schools;
  }

  /**
   * Create/save a new module.
   * POST schools
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, response }) {
    const data = request.only(['name'])

    const school = await School.create(data)

    response.status(201)

    return school
  }

  /**
   * Display a single module.
   * GET schools/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const school = await School.findOrFail(params.id)

    return school
  }

  /**
   * Update module details.
   * PUT or PATCH schools/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const school = await School.findOrFail(params.id)
    const data = request.only(['name'])

    school.merge(data)
    await school.save()

    return school
  }

  /**
   * Delete a module with id.
   * DELETE schools/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const school = await School.findOrFail(params.id)

    await school.delete()
  }
}

module.exports = SchoolController
