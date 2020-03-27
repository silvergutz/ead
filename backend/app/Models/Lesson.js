'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Lesson extends Model {
  static boot () {
    super.boot()

    // Soft Delete
    this.addTrait('@provider:Lucid/SoftDeletes')
    // Polymorphic
    this.addTrait('@provider:Morphable')
  }

  static get STATUS_DRAFT()     { return 'draft' }
  static get STATUS_PUBLISHED() { return 'published' }

  static availableStatus() {
    return [
      Lesson.STATUS_DRAFT,
      Lesson.STATUS_PUBLISHED,
    ]
  }

  module() {
    return this.belongsTo('App/Models/Module')
  }

  comments() {
    return this.hasMany('App/Models/Comment')
  }

  attachments() {
    return this
      .morphMany('App/Models/Attachment', 'id', 'attachmentable_id', 'attachmentable_type')
  }
}

module.exports = Lesson
