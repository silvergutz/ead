'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const User = use('App/Models/User')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 200).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable(),
      table.string('photo')
      table
        .integer('school_id')
        .unsigned()
        .references('id')
        .inTable('schools')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('level')
        .notNullable()
        .defaultTo(User.LEVEL_STUDENT)
      table.boolean('is_teacher').defaultTo(false)
      table.timestamps()
      table.datetime('deleted_at')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
