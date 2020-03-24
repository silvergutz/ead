'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseSchoolsSchema extends Schema {
  up () {
    this.create('course_schools', (table) => {
      table.increments()
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('school_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('schools')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })

    this.table('courses', (table) => {
      table.dropForeign(['school_id'])
      table.dropColumn('school_id')
    })
  }

  down () {
    this.drop('course_schools')

    this.table('courses', (table) => {
      table
        .integer('school_id')
        .unsigned()
        .notNullable()
        .after('cover')
        .references('id')
        .inTable('schools')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
    })
  }
}

module.exports = CourseSchoolsSchema
