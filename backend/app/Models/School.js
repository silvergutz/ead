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
    return this
      .belongsToMany('App/Models/Course', 'school_id', 'course_id')
      .pivotTable('course_schools')
      .withTimestamps()
  }

  users() {
    return this.hasMany('App/Models/User')
  }
}

module.exports = School
