'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Lesson = use('App/Models/Lesson')

class LessonSchema extends Schema {
  up () {
    this.create('lessons', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description')
      table.text('video')
      table.time('duration')
      table
        .integer('module_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('modules')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
      table
        .integer('order')
        .notNullable()
        .defaultTo(1)
      table
        .string('status')
        .notNullable()
        .defaultTo(Lesson.STATUS_DRAFT)
      table.timestamps()
      table.datetime('deleted_at')
    })
  }

  down () {
    this.drop('lessons')
  }
}

module.exports = LessonSchema
