'use strict'

const { validateBasicAuth } = require('../helpers')

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dashboard',
    method: 'GET',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: async (request) => {
      // Get all tracked coins
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.tracked ORDER BY __createdtime__ ASC'
      }
      const trackedCoins = await hdbCore.requestWithoutAuthentication(request)

      // Get the price history for each tracked coin
      const coins = trackedCoins.map(v => `'${v.coin}',`).join('').slice(0, -1)
      trackedCoins.forEach(v => { v.history = [] })
      const startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      request.body = {
        operation: 'sql',
        sql: `SELECT * FROM crypto.history WHERE coin IN (${coins}) AND __createdtime__ >= '${startDate.getTime()}' ORDER BY date DESC`
      }
      const priceHistory = await hdbCore.requestWithoutAuthentication(request)

      // Add the history to the coin objects
      trackedCoins.forEach(coin => {
        coin.history = priceHistory.filter(v => v.coin === coin.coin)
      })

      // Get all feeds configured
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.feed_handlers ORDER BY __createdtime__ DESC'
      }
      const feeds = await hdbCore.requestWithoutAuthentication(request)

      // Get all feed articles
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.articles ORDER BY __createdtime__ DESC'
      }
      const articles = await hdbCore.requestWithoutAuthentication(request)

      // Add the articles to the feed objects
      feeds.forEach(feed => {
        feed.articles = articles.filter(v => v.feed === feed.id).slice(0, 100)
      })

      // Get all feed categories configured
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.feed_categories ORDER BY __createdtime__ ASC'
      }
      const categories = await hdbCore.requestWithoutAuthentication(request)

      return {
        trackedCoins,
        feeds,
        categories: categories.map(v => v.name)
      }
    }
  })
}
