'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Module = use('App/Models/Module')

class ModuleSchema extends Schema {
  up () {
    this.create('modules', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description')
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courses')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
      table.timestamps()
      table.datetime('deleted_at')
    })
  }

  down () {
    this.drop('modules')
  }
}

module.exports = ModuleSchema
