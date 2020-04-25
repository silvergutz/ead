'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Comment = use('App/Models/Comment')
const User = use('App/Models/User')
const CommentService = use('App/Services/CommentService')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   */
  async index ({ auth, request }) {
    const { status, lesson, user } = request.get();

    const query = Comment.query()
      .with('lesson')
      .with('lesson.module.course')
      .with('user')
      .orderBy('created_at', 'desc')


    // For students show only published
    if (auth.user.level === User.LEVEL_STUDENT) {
      query.where('status', Comment.STATUS_APPROVED)
    } else if (status) {
      // Filter by status
      query.where('status', 'in', status.split(','))
    }

    // Filter by lesson
    if (parseInt(lesson)) {
      query.where('lesson_id', parseInt(lesson))
    }

    // Filter by user
    if (parseInt(user)) {
      query.where('user_id', parseInt(user))
    }

    const comments = await query.fetch();

    return comments;
  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(['content', 'lesson_id', 'parent_id', 'status'])

    data.user_id = auth.user.id
    const comment = await CommentService.save(data)

    response.status(201)

    return comment
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   */
  async show ({ params }) {
    const comment = await Comment.findOrFail(params.id)

    return comment
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    let data = request.only(['content', 'lesson_id', 'parent_id', 'status'])

    data.id = params.id
    const comment = await CommentService.save(data)

    return comment
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   */
  async destroy ({ params }) {
    const comment = await Comment.findOrFail(params.id)

    await comment.delete()
  }
}

module.exports = CommentController
