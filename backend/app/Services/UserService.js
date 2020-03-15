'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')

const User = use('App/Models/User')

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
          await Drive.move(Helpers.tmpPath(photoFile.fileName), photoStoragePath)
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
      if (photoFile && photoFile.moved() && Drive.exists(photoStoragePath)) {
        await Drive.delete(photoStoragePath)
      }
      throw new Error(e)
    }
  }
}

module.exports = UserService
