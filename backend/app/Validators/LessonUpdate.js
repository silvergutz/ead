'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class LessonUpdate extends BaseValidator {
  get rules () {
    return {
      module_id: 'required|exists:modules,id',
      status: 'in:draft,published',
    }
  }

  get sanitizationRules () {
    return {
      module_id: 'to_int'
    }
  }
}

module.exports = LessonUpdate
