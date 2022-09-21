'use strict'

const {
  checkBody,
  validateUUID,
  validateBasicAuth,
  chainValidators
} = require('../helpers')

module.exports = async (server, { hdbCore, logger }) => {
  // Get all Feed Categories
  server.route({
    url: '/feed-category',
    method: 'GET',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: (request) => {
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.feed_category'
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })

  // Add Feed Category
  server.route({
    url: '/feed-category',
    method: 'POST',
    preValidation: (request) => chainValidators([
      validateBasicAuth(request, hdbCore, logger),
      checkBody(['name'], request, logger)
    ]),
    handler: (request) => {
      request.body = {
        operation: 'insert',
        schema: 'crypto',
        table: 'feed_categories',
        records: [
          { name: request.body.name }
        ]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })

  // Remove Feed Category
  server.route({
    url: '/feed-category/:categoryId',
    method: 'DELETE',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: (request) => {
      // Ensure this is a valid ID
      if (!validateUUID(request.params.categoryId)) {
        return { error: `Invalid UUID provided for categoryId: ${request.params.categoryId}` }
      }

      request.body = {
        operation: 'delete',
        schema: 'crypto',
        table: 'feed_categories',
        hash_values: [request.params.categoryId]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })
}
