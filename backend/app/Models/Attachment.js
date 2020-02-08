'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Attachment extends Model {
  static get traits () {
    return ['@provider:Morphable']
  }

  attachmentable() {
    return this
      .morphTo(
        ['App/Models/Lesson', 'App/Models/Comment'],
        'id',
        'id',
        'attachmentable_id',
        'attachmentable_type'
      )
  }
}

module.exports = Attachment
