'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class ProfileUpdate extends BaseValidator {
  get rules () {
    const userId = this.ctx.auth.user.id

    return {
      email: `email|unique:users,email,id,${userId}`,
      password: 'min:6|max:30',
    }
  }
}

module.exports = ProfileUpdate
