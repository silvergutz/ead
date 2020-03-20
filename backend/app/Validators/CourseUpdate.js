'use strict'

const CourseStore = use('App/Validators/CourseStore')

class CourseUpdate extends CourseStore {
  get rules () {
    return {
      status: 'in:draft,published',
    }
  }
}

module.exports = CourseUpdate
