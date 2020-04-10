'use strict'

const fs = require('fs')
const Storage = require('@google-cloud/storage')
const Drive = use('Drive')
const FileType = use('file-type')
const Config = use('Config');
const Helpers = use('Helpers');

class UploadController
{
  async download({ request, response }) {
    const { file, force } = request.get()
    if (Drive.exists(file)) {
      let fileContent;
      const paths = file.split('/');
      const fileName = paths.pop();

      if (Config.get('drive.default') === 'gcs') {
        // try to get from tmp, previously downloaded
        if (!fs.existsSync(Helpers.tmpPath(file))) {
          const gcsStorage = new Storage({
            keyFilename: Config.get('drive.disks.gcs.keyFilename'),
          });
          const rootDir = Helpers.tmpPath();

          const folders = paths.join('/');
          const dir = `${rootDir}/${folders}`;
          const dest = `${dir}/${fileName}`;

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          await gcsStorage
            .bucket(Config.get('drive.disks.gcs.bucket'))
            .file(file)
            .download({ destination: dest })
        }

        fileContent = fs.readFileSync(Helpers.tmpPath(file))
      } else {
        fileContent = await Drive.get(file)
      }

      // Set Content-Type header
      const type = await FileType.fromBuffer(fileContent)
      const contentType = (type && type.mime) ? type.mime : 'application/octet-stream'
      response.header('Content-Type', contentType)

      // If marked to force download, set Content-Dispositon header
      if (force) {
        response.header('Content-Disposition', `attachment; filename=${fileName}`)
      }


      return response.send(fileContent)
    } else {
      response.notFound('file not found')
    }
  }
}

module.exports = UploadController
