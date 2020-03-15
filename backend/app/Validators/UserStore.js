'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserStore extends BaseValidator {
  get rules () {
    return {
      name: 'required',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:30',
      level: 'in:admin,manager,student',
      school_id: 'required|integer|exists:schools,id',
    }
  }

  get sanitizationRules() {
    return {
      is_teacher: 'to_int',
      school_id: 'to_int',
    }
  }
}

module.exports = UserStore
