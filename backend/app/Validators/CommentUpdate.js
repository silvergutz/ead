'use strict'

const BaseValidator = use('App/Validators/BaseValidator')
const Comment = use('App/Models/Comment')

class CommentUpdate extends BaseValidator {
  get rules () {
    return {
      lesson_id: 'exists:lessons,id',
      parent_id: 'exists:comments,id',
      status: `in:${Comment.availableStatus().join(',')}`,
    }
  }

  get sanitizationRules () {
    return {
      lesson_id: 'to_int',
      parent_id: 'to_int',
      user_id: 'to_int',
    }
  }
}

module.exports = CommentUpdate
