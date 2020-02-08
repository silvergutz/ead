'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Comment = use('App/Models/Comment')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.text('content').notNullable()
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
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('comments')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
      table
        .string('status')
        .notNullable()
        .defaultTo(Comment.STATUS_PENDING)
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
