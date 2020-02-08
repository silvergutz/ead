'use strict'

/*
|--------------------------------------------------------------------------
| LessonSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class LessonSeeder {
  async run () {
    await Factory
      .model('App/Models/Lesson')
      .create()
  }
}

module.exports = LessonSeeder
