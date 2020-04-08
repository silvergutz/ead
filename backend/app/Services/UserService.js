'use strict'

const fs = require('fs')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Config = use('Config')

const User = use('App/Models/User')
const Lesson = use('App/Models/Lesson')
const LessonHistory = use('App/Models/LessonHistory')
const CourseService = require('./CourseService')

class UserService
{
  static async save(data) {
    let { userData, photoFile, removePhoto } = data
    let photoStoragePath = ''
    let user

    // Check if is Update
    if (userData.id) {
      user = await User.findOrFail(userData.id)
    }

    try {
      // Remove current photo, if update
      if (removePhoto) {
        userData.photo = null;
      }

      // Process photo upload
      if (photoFile) {
        // Handle photo image upload
        const fileName = `${new Date().getTime()}.${photoFile.extname}`
        await photoFile.move(Helpers.tmpPath(), {
          name: fileName
        })

        // Use Drive to store images, than we can change anytime from local to cloud
        if (!photoFile.moved()) {
          return { error: photoFile.error() };
        } else {
          photoStoragePath = `users/${fileName}`

          if (Config.get('drive.default') === 'gcs') {
            await Drive.put(photoStoragePath, Helpers.tmpPath(photoFile.fileName))
          } else {
            await Drive.put(photoStoragePath, fs.readFileSync(Helpers.tmpPath(photoFile.fileName)))
          }

          userData.photo = photoStoragePath
        }
      }

      // Update a register
      if (userData.id) {
        user.merge(userData)
        await user.save()
      } else {
        user = await User.create(userData)
      }

      return user
    } catch(e) {
      if (photoFile && photoFile.moved()) {
        if (fs.existsSync(Helpers.tmpPath(photoFile.fileName))) {
          fs.unlink(Helpers.tmpPath(photoFile.fileName))
        }
        if (Drive.exists(photoStoragePath)) {
          Drive.delete(photoStoragePath)
        }
      }
      console.log(e)
      throw new Error(e)
    }
  }

  static async getProgress(user, course, perCourse) {
    if (course) {
      return CourseService.getProgress(course, user.id)
    }

    if (typeof(perCourse) === undefined) {
      perCourse = false
    }

    let progress = 0
    let courses = []

    const query = Lesson
      .query()
      .where('status', Lesson.STATUS_PUBLISHED)

    if (perCourse) {
      query.with('module.course')
    }

    const lessons = await query.fetch()

    if (lessons.rows.length) {
      const lessonValue = 100 / lessons.rows.length

      const promisses = lessons.rows.map(async (lesson) => {
        const history = await lesson
          .history()
          .select('action')
          .where('user_id', user.id)
          .groupBy('action')
          .fetch()

        if (history.rows.length) {
          if (history.rows.some(row => (lesson.video ? row.action === Lesson.ACTION_DONE : row.action === Lesson.ACTION_OPEN))) {
            progress += lessonValue
          }

          if (perCourse) {
            const course = lesson.toJSON().module.course
            if (course) {
              if (!courses.some(v => v.id == course.id)) {
                courses.push(course);
              }
            }
          }
        }
      })

      await Promise.all(promisses)

      if (perCourse) {
        const coursesPromises = courses.map(async (course) => {
          course.progress = await CourseService.getProgress(course, user.id)
          return course
        })
        courses = await Promise.all(coursesPromises)
      }
    }

    if (progress > 0) {
      progress = Math.min(100, progress)
    }

    if (perCourse) {
      return {
        progress,
        courses,
      }
    }

    return progress
  }
}

module.exports = UserService
