'use strict'

const Comment = use('App/Models/Comment')
const User = use('App/Models/User')

class CommentService
{
  static async save(data) {
    let comment

    // Check if is Update
    if (data.id) {
      comment = await Comment.findOrFail(data.id)
    }

    if (data.id) {
      comment.merge(data)
      await comment.save()
    } else {
      comment = await Comment.create(data)
    }

    return comment
  }
}

module.exports = CommentService
