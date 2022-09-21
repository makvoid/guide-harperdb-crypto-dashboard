'use strict'

const async = require('async')
const Parser = require('rss-parser')
const CronJob = require('cron').CronJob

const {
  getFeedHandlers,
  activateLock,
  checkLock,
  validateBasicAuth
} = require('../helpers')

// Path to store the lockfile at
const LOCK_PATH = '/tmp/articles.lock'

module.exports = async (server, { hdbCore, logger }) => {
  // Setup CronJob
  const job = new CronJob(
    '*/5 * * * *',
    async () => {
      const feeds = await getFeedHandlers(hdbCore, logger)
      const records = await async.map(feeds, async (feed) => {
        const parser = new Parser({ headers: { 'User-Agent': 'hdb-dashboard-feed-parser-v-1' }, ...feed.settings })
        const parsedFeed = await parser.parseURL(feed.url)
        parsedFeed.items = await async.map(parsedFeed.items, async (item) => {
          // Check if this link exists already within the DB
          let body = {
            operation: 'sql',
            sql: `SELECT * FROM crypto.articles WHERE link = '${item.link}'`
          }
          const result = await hdbCore.requestWithoutAuthentication({ body })
          // If this link already exists within the DB, do not save it
          if (result.length) return null
          // Otherwise, we'll save it
          const record = {
            creator: item.creator,
            title: item.title,
            link: item.link,
            feed: feed.id,
            contentSnippet: item.contentSnippet,
            pubDate: new Date(item.pubDate),
            isoDate: new Date(item.isoDate)
          }
          body = {
            operation: 'insert',
            schema: 'crypto',
            table: 'articles',
            records: [record]
          }
          const addArticle = await hdbCore.requestWithoutAuthentication({ body })
          return addArticle
        })
        return { feed, items: parsedFeed.items }
      })
      return { feeds, records }
    }
  )

  // Check if the Lock/Cron has started and start if idle
  const cronStarted = await checkLock(LOCK_PATH)
  if (!cronStarted && !job.running) {
    await activateLock(LOCK_PATH)
    job.start()
  }

  server.route({
    url: '/feed',
    method: 'GET',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: (request) => {
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.articles ORDER BY pubDate ASC'
      }

      return hdbCore.requestWithoutAuthentication(request)
    }
  })
}
