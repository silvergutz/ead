'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
  static get traits () {
    return ['@provider:Morphable']
  }

  static get STATUS_PENDING()  { return 'pending' }
  static get STATUS_APPROVED() { return 'approved' }
  static get STATUS_REJECTED() { return 'rejected' }

  static availableStatus() {
    return [
      Comment.STATUS_PENDING,
      Comment.STATUS_APPROVED,
      Comment.STATUS_REJECTED,
    ]
  }

  lesson() {
    return this.belongsTo('App/Models/Lesson')
  }

  user() {
    return this.belongsTo('App/Models/User').withTrashed()
  }

  parent() {
    return this.belongsTo('App/Models/Comment', 'parent_id', 'id')
  }

  children() {
    return this.hasMany('App/Models/Comment', 'id', 'parent_id')
  }

  attachments() {
    return this
      .morphMany('App/Models/Attachment', 'id', 'attachmentable_id', 'attachmentable_type')
  }
}

module.exports = Comment
