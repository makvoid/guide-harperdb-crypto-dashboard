'use strict'

/**
 * Return all configured feed handlers for this Instance
 *
 * @param hdbCore: HDB Core object
 * @param logger: Logger HDB Logger
 * @returns list of feed handlers
 */
const getFeedHandlers = async (hdbCore, logger) => {
  const request = {
    body: {
      operation: 'sql',
      sql: 'SELECT * FROM crypto.feed_handlers'
    }
  }

  let feedHandlers
  try {
    feedHandlers = await hdbCore.requestWithoutAuthentication(request)
  } catch (e) {
    logger.error(e)
    return []
  }
  return feedHandlers
}

module.exports = getFeedHandlers
