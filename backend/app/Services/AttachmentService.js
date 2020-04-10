'use strict'

const fs = require('fs')
const FileType = require('file-type')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Config = use('Config')

const Attachment = use('App/Models/Attachment')
const Lesson = use('App/Models/Lesson')
const Comment = use('App/Models/Comment')

class AttachmentService
{
  static async save(data) {
    let { attachmentData, file } = data
    let storagePath = ''
    let attachmentable
    let attachment

    // Can't save file without file
    if (!file) {
      throw new Error('File cannot be null')
    }

    // Check if attachmentable exists
    if (attachmentData.attachmentable_type && attachmentData.attachmentable_id) {
      if (attachmentData.attachmentable_type == 'lessons') {
        attachmentable = Lesson.findOrFail(attachmentData.attachmentable_id)
      } else if (attachmentData.attachmentable_type == 'comments') {
        attachmentable = Comment.findOrFail(attachmentData.attachmentable_id)
      }
    }

    // Attachmentable cannot be reached
    if (!attachmentable) {
      throw new Error('Attachmentable cannot be reached')
    }

    let tmpFileName

    try {
      // Handle file upload
      const originalFileName = file.clientName.toLowerCase()
      tmpFileName = originalFileName

      let c = 1
      while (fs.existsSync(Helpers.tmpPath(tmpFileName)) && c <= 20) {
        // last change, after 19 times to change file name, use current timestamp
        if (c == 20) {
          c = (new Date()).getTime()
        }

        tmpFileName = `${originalFileName.substr(0, originalFileName.indexOf(file.extname) - 1)}(${c}).${file.extname}`
        c++
      }

      await file.move(Helpers.tmpPath(), {
        name: tmpFileName
      })

      // Use Drive to store images, than we can change anytime from local to cloud
      if (!file.moved()) {
        return { error: file.error() };
      } else {
        storagePath = `attachments/${originalFileName}`

        // Rename file if it already exists on Drive
        let c = 1
        while (await Drive.exists(storagePath) && c <= 20) {
          // last change, after 19 times to change file name, use current timestamp
          if (c == 20) {
            c = (new Date()).getTime()
          }

          let fileName = `${originalFileName.substr(0, originalFileName.indexOf(file.extname) - 1)}(${c}).${file.extname}`
          storagePath = `attachments/${fileName}`
          c++
        }

        const tmpFilePath = Helpers.tmpPath(tmpFileName)

        if (Config.get('drive.default') === 'gcs') {
          await Drive.put(storagePath, tmpFilePath)
        } else {
          await Drive.put(storagePath, fs.readFileSync(tmpFilePath))
        }

        const type = await FileType.fromFile(tmpFilePath)
        if (type && type.mime) {
          attachmentData.mime = type.mime
        }
        attachmentData.url = storagePath
      }

      // Create a register
      attachment = await Attachment.create(attachmentData)

      return attachment
    } catch(e) {
      console.log(e)

      if (file && file.moved() && typeof tmpFileName !== undefined) {
        if (fs.existsSync(Helpers.tmpPath(tmpFileName))) {
          fs.unlinkSync(Helpers.tmpPath(tmpFileName))
        }
        if (storagePath && Drive.exists(storagePath)) {
          Drive.delete(storagePath)
        }
      }

      throw new Error(e.message)
    }
  }
}

module.exports = AttachmentService
