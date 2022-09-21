'use strict'

/**
 * Returns a list of all tracked cryptocurrencies
 *
 * @param hdbCore: HDB Core object
 * @param logger: Logger HDB Logger
 * @returns list of tracked cryptocurrencies
 */
const getTrackedCoins = async (hdbCore, logger) => {
  const request = {
    body: {
      operation: 'sql',
      sql: 'SELECT coin FROM crypto.tracked'
    }
  }

  let trackedCoins
  try {
    trackedCoins = await hdbCore.requestWithoutAuthentication(request)
  } catch (e) {
    logger.error(e)
    return []
  }
  return trackedCoins.map(v => v.coin)
}

module.exports = getTrackedCoins
