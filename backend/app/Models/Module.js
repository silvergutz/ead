'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Module extends Model {
  static boot () {
    super.boot()

    /**
     * Soft Delete
     */
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  course() {
    return this.belongsTo('App/Models/Course')
  }

  lessons() {
    return this.hasMany('App/Models/Lesson')
  }
}

module.exports = Module
