'use strict'

const fetch = require('node-fetch')

// Coin Market Cap API Key
const API_KEY = 'your-api-key-here'
// Use the Sandbox API for sample data with no usage limits
const USE_SANDBOX = false

// URL definitions
const URL_SLUG = USE_SANDBOX ? 'sandbox-api' : 'pro-api'
const API_URL = `https://${URL_SLUG}.coinmarketcap.com`

/**
 * Sets a Date object's seconds/ms to zero
 *
 * @param {Number} input milliseconds of date to set
 * @returns Date
 */
const setTimeSeconds = (input) => {
  // Convert to a date object
  input = new Date(input)
  // Set the seconds/ms to zero
  input.setSeconds(0)
  input.setMilliseconds(0)
  // Return the new date
  return input
}

/**
 * Returns the latest price information for the supplied slugs
 *
 * @param {string[]} slugs list of cryptocurrency slugs to check pricing for
 * @param logger: Logger HDB Logger
 * @returns list of cryptocurrency pricing objects
 */
const getPrices = async (slugs, logger) => {
  // Must pass our API key in the headers
  const options = { headers: { 'X-CMC_PRO_API_KEY': API_KEY } }
  // Submit request to the API
  let req
  try {
    req = await fetch(
      `${API_URL}/v2/cryptocurrency/quotes/latest?slug=${slugs.join(',')}`,
      options
    )
  } catch (e) {
    console.error(e)
    return []
  }
  // Parse the response as JSON
  let res
  try {
    res = await req.json()
  } catch (e) {
    console.error(e)
    return []
  }
  // Return the price quote per symbol
  return Object.entries(res.data).map(([slug, data]) => {
    const date = setTimeSeconds(data.quote.USD.last_updated)
    return {
      coin: data.slug,
      symbol: data.symbol,
      price: data.quote.USD.price,
      date
    }
  })
}

module.exports = getPrices
