'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class School extends Model {
  static boot () {
    super.boot()

    /**
     * Soft Delete
     */
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  courses() {
    return this.hasMany('App/Models/Course')
  }

  users() {
    return this.hasMany('App/Models/User')
  }
}

module.exports = School
