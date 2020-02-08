'use strict'

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Category')

const Category = use('App/Models/Category')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a category', async ({ client }) => {
  const userToAuth = await User.first()

  const category = await Factory.model('App/Models/Category').make()

  const categoryData = {
    name: category.name,
    description: category.description,
  }

  console.log(categoryData)

  const response = await client
    .post('/categories')
    .send(categoryData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset(categoryData)
})


test('get list of categories', async ({ client }) => {
  const userToAuth = await User.first()
  const category = await Category.first()

  const responseUnauthorized = await client
    .get('/categories')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/categories')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    name: category.name,
    description: category.description,
  }])
})

test('get a category', async ({ client }) => {
  const userToAuth = await User.first()

  const category = await Category.first()

  const response = await client
    .get(`/categories/${category.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: category.name,
    description: category.description,
  })
})

test('update a category', async ({ client }) => {
  const userToAuth = await User.first()
  const category = await Category.first()

  const newCategoryData = {
    name: 'updated name',
    description: 'updated description'
  }

  const response = await client
    .put(`/categories/${category.id}`)
    .send(newCategoryData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(newCategoryData)
})

test('delete a category', async ({ client }) => {
  const userToAuth = await User.first()
  const category = await Factory.model('App/Models/Category').create()

  const response = await client
    .delete(`/categories/${category.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
