'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class LessonStore extends BaseValidator {
  get rules () {
    return {
      name: 'required',
      module_id: 'required|exists:modules,id',
      status: 'required|in:draft,published',
    }
  }

  get sanitizationRules () {
    return {
      module_id: 'to_int'
    }
  }
}

module.exports = LessonStore
