'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   */
  async index () {
    const categories = await Category.all();

    return categories;
  }

  /**
   * Create/save a new module.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, response }) {
    const data = request.only(['name','description'])

    const category = await Category.create(data)

    response.status(201)

    return category
  }

  /**
   * Display a single module.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const category = await Category.findOrFail(params.id)

    return category
  }

  /**
   * Update module details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const category = await Category.findOrFail(params.id)
    const data = request.only(['name','description'])

    category.merge(data)
    await category.save()

    return category
  }

  /**
   * Delete a module with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const category = await Category.findOrFail(params.id)

    await category.delete()
  }
}

module.exports = CategoryController
