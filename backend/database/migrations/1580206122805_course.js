'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Course = use('App/Models/Course')

class CourseSchema extends Schema {
  up () {
    this.create('courses', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description')
      table.string('cover')
      table
        .integer('school_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('schools')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
      table
        .string('status')
        .notNullable()
        .defaultTo(Course.STATUS_DRAFT)
        // .defaultTo('draft')
      table.timestamps()
      table.datetime('deleted_at')
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CourseSchema
