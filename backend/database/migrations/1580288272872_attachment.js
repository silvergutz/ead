'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AttachmentSchema extends Schema {
  up () {
    this.create('attachments', (table) => {
      table.increments()
      table.string('url').notNullable()
      table.string('mime')
      table
        .integer('attachmentable_id')
        .unsigned()
        .notNullable()
      table
        .string('attachmentable_type', 20)
        .notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('attachments')
  }
}

module.exports = AttachmentSchema
