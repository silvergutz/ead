'use strict'

const Drive = use('Drive')
const FileType = use('file-type')

class UploadController
{
  async download({ request, response }) {
    const { file } = request.get()
    if (Drive.exists(file)) {
      const fileContent = await Drive.get(file)
      const { mime } = await FileType.fromBuffer(fileContent)
      response.header('Content-type', mime)
      return response.send(fileContent)
    } else {
      response.notFound('file not found')
    }
  }
}

module.exports = UploadController
