'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
  static boot () {
    super.boot()

    /**
     * Soft Delete
     */
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  static get STATUS_DRAFT()     { return 'draft' }
  static get STATUS_PUBLISHED() { return 'published' }

  static availableStatus() {
    return [
      Course.STATUS_DRAFT,
      Course.STATUS_PUBLISHED,
    ]
  }

  school() {
    return this.belongsTo('App/Models/School')
  }

  categories() {
    return this
      .belongsToMany('App/Models/Category', 'course_id', 'category_id')
      .pivotTable('course_categories')
      .withTimestamps()
  }

  teachers() {
    return this
      .belongsToMany('App/Models/User', 'course_id', 'user_id')
      .pivotTable('course_teachers')
      .withTimestamps()
  }

  modules() {
    return this.hasMany('App/Models/Module')
  }

  lessons() {
    return this.manyThrough('App/Models/Module', 'lessons')
  }
}

module.exports = Course
