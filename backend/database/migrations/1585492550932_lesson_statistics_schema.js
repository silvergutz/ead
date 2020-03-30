'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Lesson = use('App/Models/Lesson')

class LessonHistorySchema extends Schema {
  up () {
    this.create('lesson_history', (table) => {
      table
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('action')
        .notNullable()
        .defaultTo(Lesson.ACTION_OPEN)
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('lesson_history')
  }
}

module.exports = LessonHistorySchema
