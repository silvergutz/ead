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

  static get ACTION_OPEN()      { return 'open' }
  static get ACTION_START()     { return 'start' }
  static get ACTION_DONE()      { return 'done' }

  static availableStatus() {
    return [
      Lesson.STATUS_DRAFT,
      Lesson.STATUS_PUBLISHED,
    ]
  }

  static availableActions() {
    return [
      Lesson.ACTION_OPEN,
      Lesson.ACTION_START,
      Lesson.ACTION_DONE,
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

  history() {
    return this.hasMany('App/Models/LessonHistory')
  }
}

module.exports = Lesson
