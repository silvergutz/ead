'use strict'

const UserService = require('../../Services/UserService')

const photoRules = {
  types: ['image'],
  size: '2mb',
  extnames: ['jpg','jpeg','png'],
}

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Course = use('App/Models/Course')

/**
 * Resourceful controller for interacting with users
 */
class UserController {

  /**
   * Check if a current user has permission to se the progress of other
   *
   * @param integer currentUser Current User id
   * @param integer target      Target User id
   * @return boolean
   */
  _canUserSeeProgress(currentUser, target) {
    // Students are not allowed to view progress of other users
    if (currentUser.level !== User.LEVEL_STUDENT || target == currentUser.id) {
      return true;
    }

    return false;
  }

  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index ({ request, auth }) {
    const { s, progress } = request.get();

    const query = User.query()

    if (s) {
      const searchTerm = '%' + s.replace(/\s/g, '%') + '%'
      query.where('name', 'like', searchTerm)
    }

    const users = await query.fetch()

    if (!progress || !users.rows.length) {
      return users
    }

    const promisses = users.rows.map(async user => {
      if (this._canUserSeeProgress(auth.user, user)) {
        const progress = await UserService.getProgress(user)
        user.progress = progress
      }

      return user
    })

    return Promise.all(promisses)
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
    const data = {
      userData: request.only(['name', 'email', 'password', 'level', 'is_teacher', 'school_id']),
      photoFile: request.file('photo', photoRules),
    }

    const result = await UserService.save(data)

    if (result.error) {
      response.status(400)
      return result
    }

    response.status(201)

    return result
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Parameters} ctx.params
   */
  async show ({ request, response, params, auth }) {
    const user = await User.findOrFail(params.id)
    const { progress } = request.get()

    if (progress) {
      user.progress = await UserService.getProgress(user)
    }

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
    const data = {
      userData: request.only(['name', 'email', 'password', 'level', 'is_teacher', 'school_id']),
      photoFile: request.file('photo', photoRules),
      removePhoto: request.input('remove_photo', false),
    }

    data.userData.id = parseInt(params.id)

    const user = await UserService.save(data)

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

  /**
   * Display the percentage of lessons completed by an user
   * GET users/:id/progress/:course?
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async progress ({ params, response, auth }) {
    // Students are not allowed to view progress of other users
    if (!this._canUserSeeProgress(auth.user, params.id)) {
      response.status(403)
      return {
        error: 'Forbidden - Your are not allowed to see the progress of this user'
      }
    }

    const course = params.course ? await Course.findOrFail(params.course) : null
    const user = await User.findOrFail(params.id)

    const progress = await UserService.getProgress(user, course)

    return {
      progress
    }
  }
}

module.exports = UserController
