'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const users = await User.all()

    return users
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const userData = request.only(['name', 'email', 'password', 'photo', 'school_id', 'level', 'is_teacher'])

    const user = await User.create(userData)

    response.status(201)

    return user
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const user = await User.findOrFail(params.id)

    return user
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['name', 'email', 'password', 'photo', 'school_id', 'level', 'is_teacher'])

    user.merge(data)
    await user.save()

    return user
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    if (parseInt(auth.user.id) === parseInt(params.id)) {
      response.status(401)
      return { error: 'You can\'t delete yourself' }
    }

    const user = await User.findOrFail(params.id)

    await user.delete();
  }
}

module.exports = UserController
