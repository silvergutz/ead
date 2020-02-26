'use strict'

const { formatters } = use('Validator')

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
}

module.exports = BaseValidator
