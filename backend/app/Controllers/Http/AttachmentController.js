'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Attachment = use('App/Models/Attachment')
const AttachmentService = use('App/Services/AttachmentService')

const fileRules = {
  size: '500mb',
}

/**
 * Resourceful controller for interacting with attachments
 */
class AttachmentController {
  /**
   * Show a list of all attachments.
   * GET attachments
   *
   * @param {object} ctx
   */
  async index ({ request }) {
    const { pid, ptype } = request.only(['pid', 'ptype'])

    const query = Attachment
      .query()

    if (pid) {
      query.where('attachmentable_id', parseInt(pid))
    }
    if (ptype) {
      query.where('attachmentable_type', ptype)
    }

    const attachments = await query.fetch()

    return attachments;
  }

  /**
   * Create a new attachment.
   * POST attachments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, response }) {
    const data = {
      attachmentData: request.only(['attachmentable_type', 'attachmentable_id']),
      file: request.file('file', fileRules),
    }

    const result = await AttachmentService.save(data)

    if (!result || result.error) {
      response.status(400)
      return result
    }

    response.status(201)

    return result
  }

  /**
   * Display a single module.
   * GET attachments/:id
   *
   * @param {object} ctx
   * @param {Parameters} ctx.params
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const attachment = await Attachment.findOrFail(params.id)

    return attachment
  }

  /**
   * Delete a module with id.
   * DELETE attachments/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const attachment = await Attachment.findOrFail(params.id)

    await attachment.delete()
  }
}

module.exports = AttachmentController
