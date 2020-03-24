'use strict'

const { duration } = require('moment')
const { google } = require('googleapis')
const Env = use('Env')
const Lesson = use('App/Models/Lesson')

class LessonService
{
  static async save(data) {
    let lesson

    // Check if is Update
    if (data.id) {
      lesson = await Lesson.findOrFail(data.id)
    }

    if (data.video && !data.duration) {
      if (!lesson || !lesson.video || (lesson.video && lesson.video !== data.video)) {
        data.duration = await this.getVideoDuration(data.video)
      }
    }

    if (data.id) {
      lesson.merge(data)
      await lesson.save()
    } else {
      lesson = await Lesson.create(data)
    }

    return lesson
  }

  static getVideoIdFromUrl(video) {
    let videoId = null

    // https://youtu.be/{videoId}
    if (video.indexOf('youtu.be') >= 0) {
      videoId = video.substr(video.lastIndexOf('/') + 1)

    // https://www.youtube.com/watch?v={videoId}
    // https://www.youtube.com/embed/{videoId}
    } else {
      if (video.indexOf('/watch') >= 0) {
        videoId = video.substr(video.lastIndexOf('?v=') + 3)
      } else if (video.indexOf('/embed/') >= 0 || video.indexOf('/v/') >= 0) {
        videoId = video.substr(video.lastIndexOf('/') + 1)
      }
    }

    return videoId
  }

  static async getVideoDuration(video) {
    try {
      const videoId = this.getVideoIdFromUrl(video)

      if (videoId) {
        const youtube = google.youtube({
          version: 'v3',
          auth: Env.get('GOOGLE_API_KEY')
        })

        if (youtube) {
          const response = await youtube.videos.list({
            part: 'contentDetails',
            id: videoId
          })

          if (response && response.data) {
            if (response.data.items && response.data.items.length) {
              const { contentDetails } = response.data.items[0]
              if (contentDetails.duration) {
                const videoDuration = duration(contentDetails.duration)
                if (!videoDuration.invalid || !videoDuration.invalid()) {
                  const hours   = videoDuration.hours()   < 10 ? '0' + videoDuration.hours()   : videoDuration.hours()
                  const minutes = videoDuration.minutes() < 10 ? '0' + videoDuration.minutes() : videoDuration.minutes()
                  const seconds = videoDuration.seconds() < 10 ? '0' + videoDuration.seconds() : videoDuration.seconds()

                  return `${hours}:${minutes}:${seconds}`
                }
              }
            }
          }
        }
      }
    } catch(e) {
      console.log(e)
      return null
    }

    return null
  }
}

module.exports = LessonService
