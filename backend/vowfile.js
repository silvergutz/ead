const { isString, isObject } = require('lodash')
const ace = require('@adonisjs/ace')

const Config = use('Config')
const Server = use('Adonis/Src/Server')

const defaultConf = Config.get(`database.${Config.get('database.connection')}`)
const { connection: dbConnection } = defaultConf
const datname = isString(dbConnection)
  ? new URL(dbConnection).pathname.split('/')[1]
  : isObject(dbConnection) ? dbConnection.database : undefined

const defaultDatabase = connection => {
  let newConnection

  if (isString(connection)) {
    const connUrl = new URL(connection)
    connUrl.pathname = defaultConf.client == 'pg' ? 'postgres' : ''
    newConnection = connUrl.href
  } else if (isObject(connection)) {
    newConnection = Object.assign({}, connection)

    if (defaultConf.client === 'pg') {
      newConnection.database = 'postgres'
    } else {
      delete newConnection.database
    }
  } else {
    throw new TypeError('Connection argument must be a string or an object.');
  }

  return newConnection
}

// Vanilla connection without the database name
const conf = Object.assign({}, defaultConf)
conf.connection = defaultDatabase(dbConnection)

module.exports = (cli, runner) => {
  runner.before(async () => {
    /*
    |--------------------------------------------------------------------------
    | Start the server
    |--------------------------------------------------------------------------
    |
    | Starts the http server before running the tests. You can comment this
    | line, if http server is not required
    |
    */
    Server.listen(process.env.HOST, process.env.PORT)

    /*
    |--------------------------------------------------------------------------
    | Create test database
    |--------------------------------------------------------------------------
    |
    | Create the test database before starting the tests.
    |
    */
    if (!datname) {
      throw new Error('Invalid database configuration')
    }

    let knex = require('knex')(defaultConf)

    try {
      await knex(datname)
    } catch (e) {
      if (/database \"(.*)\" does not exist/i.test(e.message)
       || /Unknown database \'(.*)\'/i.test(e.message)) {
        // Connect without selecting database.
        knex = require('knex')(conf)
        await knex.raw(`CREATE DATABASE ${datname};`)
      }
    } finally {
      await knex.destroy()
    }

    /*
    |--------------------------------------------------------------------------
    | Run migrations
    |--------------------------------------------------------------------------
    |
    | Migrate the database before starting the tests.
    |
    */
    await ace.call('migration:run')

    /*
    |--------------------------------------------------------------------------
    | Seed data
    |--------------------------------------------------------------------------
    |
    */
    await ace.call('seed')
  })

  runner.after(async () => {
    /*
    |--------------------------------------------------------------------------
    | Shutdown server
    |--------------------------------------------------------------------------
    |
    | Shutdown the HTTP server when all tests have been executed.
    |
    */
    Server.getInstance().close()

    /*
    |--------------------------------------------------------------------------
    | Rollback migrations
    |--------------------------------------------------------------------------
    |
    | Once all tests have been completed, we should reset the database to it's
    | original state
    |
    */
    await ace.call('migration:reset')

    /*
    |--------------------------------------------------------------------------
    | Teardown database
    |--------------------------------------------------------------------------
    |
    */
    const knex = require('knex')(conf)
    await knex.raw(`DROP DATABASE ${datname};`)
    await knex.destroy()
  })
}
