'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * Soft Delete
     */
    this.addTrait('@provider:Lucid/SoftDeletes')

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get hidden() {
    return ['password']
  }

  static get LEVEL_ADMIN()   { return 'admin' }
  static get LEVEL_MANAGER() { return 'manager' }
  static get LEVEL_STUDENT() { return 'student' }

  static availableLevels() {
    return [
      User.LEVEL_ADMIN,
      User.LEVEL_MANAGER,
      User.LEVEL_STUDENT,
    ]
  }

  comments() {
    return this.hasMany('App/Models/Comment')
  }

  school() {
    return this.belongsTo('App/Models/School')
  }

  courses() {
    return this
      .belongsToMany('App/Models/Course', 'user_id', 'course_id')
      .pivotTable('course_teachers')
      .withTimestamps()
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
