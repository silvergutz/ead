'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class CourseStore extends BaseValidator {
  get rules () {
    return {
      name: 'required',
      school_id: 'required|exists:schools,id',
      status: 'in:draft,published',
    }
  }

  get sanitizationRules () {
    return {
      school_id: 'to_int'
    }
  }
}

module.exports = CourseStore
