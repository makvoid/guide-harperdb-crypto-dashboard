'use strict'

const async = require('async')
const CronJob = require('cron').CronJob

const {
  chainValidators,
  checkBody,
  checkLock,
  getPrices,
  getTrackedCoins,
  activateLock,
  validateBasicAuth,
  validateUUID
} = require('../helpers')

// Path to store the lockfile at
const LOCK_PATH = '/tmp/pricing.lock'

module.exports = async (server, { hdbCore, logger }) => {
  // Setup CronJob
  const job = new CronJob(
    '*/15 * * * *',
    async () => {
      const trackedCoinSlugs = await getTrackedCoins(hdbCore, logger)
      let prices = await getPrices(trackedCoinSlugs, logger)

      // Validate the prices are not duplicates
      prices = await async.map(prices, async (entry) => {
        const body = { operation: 'sql', sql: `SELECT * FROM crypto.history WHERE coin = '${entry.coin}' AND date = '${entry.date}'` }
        const result = await hdbCore.requestWithoutAuthentication({ body })
        return result.length ? null : entry
      })

      // Send insert requests
      const body = {
        operation: 'insert',
        schema: 'crypto',
        table: 'history',
        records: prices
      }
      const result = await hdbCore.requestWithoutAuthentication({ body })
      return result
    }
  )

  // Check if the Lock/Cron has started and start if idle
  const cronStarted = await checkLock(LOCK_PATH)
  if (!cronStarted && !job.running) {
    await activateLock(LOCK_PATH)
    job.start()
  }

  server.route({
    url: '/tracked',
    method: 'POST',
    preValidation: (request) => chainValidators([
      validateBasicAuth(request, hdbCore, logger),
      checkBody(['coin'])
    ]),
    handler: (request) => {
      request.body = {
        operation: 'insert',
        schema: 'crypto',
        table: 'tracked',
        records: [
          { ...request.body }
        ]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })

  server.route({
    url: '/tracked/:trackId',
    method: 'DELETE',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: (request) => {
      // Ensure this is a valid ID
      if (!validateUUID(request.params.trackId)) {
        return { error: `Invalid UUID provided for trackId: ${request.params.trackId}` }
      }

      request.body = {
        operation: 'delete',
        schema: 'crypto',
        table: 'tracked',
        hash_values: [request.params.trackId]
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })
}
