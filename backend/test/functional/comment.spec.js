'use strict'

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Comment')

const Course = use('App/Models/Course')
const Comment = use('App/Models/Comment')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('create a comment', async ({ client }) => {
  const userToAuth = await User.first()

  const comment = await Factory.model('App/Models/Comment').make()

  let commentData = {
    content: comment.content,
    lesson_id: comment.lesson_id,
    parent_id: null,
    status: comment.status,
  }

  // Lesson not found
  const responseError = await client
    .post('/comments')
    .send({ ...commentData, lesson_id: 999, status: 'not' })
    .loginVia(userToAuth, 'jwt')
    .end()

  responseError.assertStatus(400)
  responseError.assertJSONSubset({
    errors: [
      { title: 'exists', source: { pointer: 'lesson_id' } },
      { title: 'in', source: { pointer: 'status' } }
    ]
  })


  // Insertion OK
  const response = await client
    .post('/comments')
    .send(commentData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(201)
  // response.assertJSONSubset(commentData)
})

test('get list of comments', async ({ client }) => {
  const userToAuth = await User.first()
  const comment = await Comment.first()

  const responseUnauthorized = await client
    .get('/comments')
    .end()

  responseUnauthorized.assertStatus(401)


  const response = await client
    .get('/comments')
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
})

test('get a comment', async ({ client }) => {
  const userToAuth = await User.first()

  const comment = await Comment.first()

  const response = await client
    .get(`/comments/${comment.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    content: comment.content,
    lesson_id: comment.lesson_id,
    parent_id: comment.parent_id,
    status: comment.status,
  })
})

test('update a comment', async ({ client }) => {
  const userToAuth = await User.first()
  const comment = await Comment.first()

  const commentFaker = await Factory.model('App/Models/Comment').make()

  const newCommentData = {
    content: commentFaker.content,
    lesson_id: commentFaker.lesson_id,
    parent_id: commentFaker.parent_id,
    status: commentFaker.status,
  }

  const response = await client
    .put(`/comments/${comment.id}`)
    .send(newCommentData)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(newCommentData)
})

test('delete a comment', async ({ client }) => {
  const userToAuth = await User.first()
  const comment = await Factory.model('App/Models/Comment').create()

  const response = await client
    .delete(`/comments/${comment.id}`)
    .loginVia(userToAuth, 'jwt')
    .end()

  response.assertStatus(204)
})
