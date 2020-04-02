'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LessonHistory extends Model {
  static get table () {
    return 'lesson_history'
  }

  lesson() {
    return this.belongsTo('App/Models/Lesson')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = LessonHistory
