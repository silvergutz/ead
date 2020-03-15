'use strict'

const UserService = require('../../Services/UserService')

const photoRules = {
  types: ['image'],
  size: '2mb',
  extnames: ['jpg','jpeg','png'],
}

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Authentication')} Auth */

const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with users
 */
class ProfileController {

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Authentication} ctx.auth
   */
  async show ({ auth }) {
    const user = await User.findOrFail(auth.user.id)

    return user
  }

  /**
   * Update user profile details.
   * PUT or PATCH profile
   *
   * @param {object} ctx
   * @param {Authentication} ctx.auth
   * @param {Request} ctx.request
   */
  async update ({ auth, request }) {
    const data = {
      userData: request.only(['name', 'email', 'password']),
      photoFile: request.file('photo', photoRules),
      removePhoto: request.input('remove_photo', false),
    }

    data.userData.id = parseInt(auth.user.id)

    const user = await UserService.save(data)

    return user
  }
}

module.exports = ProfileController
