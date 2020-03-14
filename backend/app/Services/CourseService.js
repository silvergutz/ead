'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')

const Course = use('App/Models/Course')
const School = use('App/Models/School')
const Category = use('App/Models/Category')
const User = use('App/Models/User')

class CourseService
{
  static async save(data) {
    let { courseData, coverFile, removeCover, categories, teachers } = data
    let coverStoragePath = ''
    let course

    // Check if is Update
    if (courseData.id) {
      course = await Course.findOrFail(courseData.id)
    }

    try {
      // Find School
      if (courseData.id) {
        // Dont allow update school_id
        delete courseData.school_id
      } else {
        courseData.school_id = parseInt(courseData.school_id)
        const school = courseData.school_id ? await School.find(courseData.school_id) : null
        if (!school) {
          return { error: 'School not found' }
        }
      }

      // Remove current cover, if update
      if (removeCover) {
        courseData.cover = null;
      }

      // Process cover upload
      if (coverFile) {
        // Handle cover image upload
        const fileName = `${new Date().getTime()}.${coverFile.extname}`
        await coverFile.move(Helpers.tmpPath(), {
          name: fileName
        })

        // Use Drive to store images, than we can change anytime from local to cloud
        if (!coverFile.moved()) {
          return { error: coverFile.error() };
        } else {
          coverStoragePath = `courses/${fileName}`
          await Drive.move(Helpers.tmpPath(coverFile.fileName), coverStoragePath)
          courseData.cover = coverStoragePath
        }
      }

      // Update a register
      if (courseData.id) {
        course.merge(courseData)
        await course.save()
      } else {
        course = await Course.create(courseData)
      }

      // Categories
      if (categories) {
        // Can be passed as string representation of array (multipart-form-data)
        if (typeof categories === 'string') {
          categories = JSON.parse(categories)
        }
        // making shure that is an array
        if (!Array.isArray(categories)) {
          categories = [categories];
        }
        // passed vi FormData
        if (typeof categories[0] === 'string') {
          categories = JSON.parse(`[${categories[0]}]`)
        }
        categories = await Category
          .query()
          .whereIn('id', categories)
          .pluck('id')
        await course.categories().sync(categories)
      }

      // Teachers
      if (teachers) {
        if (typeof teachers === 'string') {
          teachers = JSON.parse(teachers)
        }
        if (!Array.isArray(teachers)) {
          teachers = [teachers];
        }
        if (typeof teachers[0] === 'string') {
          teachers = JSON.parse(`[${teachers[0]}]`)
        }
        teachers = await User
          .query()
          .whereIn('id', teachers)
          .pluck('id')
        await course.teachers().sync(teachers)
      }

      return course
    } catch(e) {
      if (coverFile && coverFile.moved() && Drive.exists(coverStoragePath)) {
        await Drive.delete(coverStoragePath)
      }
      throw new Error(e)
    }
  }
}

module.exports = CourseService
