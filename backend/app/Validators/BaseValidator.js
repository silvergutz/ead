'use strict'

const { formatters } = use('Validator')
const Logger = use('Logger');
const Antl = use('Antl');

class BaseValidator {
  get validateAll () {
    return true
  }

  async fails (errorMessages) {
    this.ctx.response.status(400)
    return this.ctx.response.send(errorMessages)
  }

  get formatter () {
    return formatters.JsonApi
  }

  get messages() {
    return {
      "name.required": Antl.formatMessage('validations.required', {field: 'nome'}),
      "email.required": Antl.formatMessage('validations.required', {field: 'e-mail'}),
      "school_id.required": Antl.formatMessage('validations.required', {field: 'loja'}),
      "course_id.required": Antl.formatMessage('validations.required', {field: 'curso'}),
      "module_id.required": Antl.formatMessage('validations.required', {field: 'modulo'}),
      "lesson_id.required": Antl.formatMessage('validations.required', {field: 'aula'}),
      "level.required": Antl.formatMessage('validations.required', {field: 'nível'}),
      "is_teacher.required": Antl.formatMessage('validations.required', {field: 'professor'}),
      "status.required": Antl.formatMessage('validations.required', {field: 'status'})
    }
  }
}

module.exports = BaseValidator
