'use strict'

/*
|--------------------------------------------------------------------------
| ModuleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ModuleSeeder {
  async run () {
    await Factory
      .model('App/Models/Module')
      .create()
  }
}

module.exports = ModuleSeeder
