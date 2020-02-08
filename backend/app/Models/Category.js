'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  static boot () {
    super.boot()

    /**
     * Soft Delete
     */
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  courses() {
    return this
      .belongsToMany('App/Models/Course', 'category_id', 'course_id')
      .pivotTable('course_categories')
      .withTimestamps()
  }
}

module.exports = Category
