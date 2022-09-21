'use strict'

const {
  chainValidators,
  checkBody,
  validateBasicAuth,
  validateUUID
} = require('../helpers')

module.exports = async (server, { hdbCore, logger }) => {
  // Create feed
  server.route({
    url: '/feed-handler',
    method: 'POST',
    preValidation: (request) => chainValidators([
      validateBasicAuth(request, hdbCore, logger),
      checkBody(['name', 'url'])
    ]),
    handler: (request) => {
      const record = request.body
      // Always interpret the settings as a string value
      record.settings = `${record.settings}`
      request.body = {
        operation: 'insert',
        schema: 'crypto',
        table: 'feed_handlers',
        records: [
          record
        ]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })

  // Edit feed
  server.route({
    url: '/feed-handler/:feedId',
    method: 'POST',
    preValidation: (request) => chainValidators([
      validateBasicAuth(request, hdbCore, logger),
      checkBody(['name', 'url'])
    ]),
    handler: (request) => {
      // Ensure this is a valid ID
      if (!validateUUID(request.params.feedId)) {
        return { error: `Invalid UUID provided for feedId: ${request.params.feedId}` }
      }

      const record = { ...request.body }
      request.body = {
        operation: 'update',
        schema: 'crypto',
        table: 'feed_handlers',
        records: [record]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })

  // Delete feed
  server.route({
    url: '/feed-handler/:feedId',
    method: 'DELETE',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: (request) => {
      // Ensure this is a valid ID
      if (!validateUUID(request.params.feedId)) {
        return { error: `Invalid UUID provided for feedId: ${request.params.feedId}` }
      }

      request.body = {
        operation: 'delete',
        schema: 'crypto',
        table: 'feed_handlers',
        hash_values: [request.params.feedId]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })
}
