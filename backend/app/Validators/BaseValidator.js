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
      "status.required": Antl.formatMessage('validations.required', {field: 'status'})
    }
  }
}

module.exports = BaseValidator
