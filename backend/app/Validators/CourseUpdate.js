'use strict'

const CourseStore = use('App/Validators/CourseStore')

class CourseUpdate extends CourseStore {
  get rules () {
    return {
      school_id: 'exists:schools,id',
      status: 'in:draft,published',
    }
  }
}

module.exports = CourseUpdate
