'use strict'

const chainValidators = require('./chainValidators')
const checkBody = require('./checkBody')
const getFeedHandlers = require('./getFeedHandlers')
const getPrices = require('./getPrices')
const getTrackedCoins = require('./getTrackedCoins')
const validateBasicAuth = require('./validateBasicAuth')
const validateUUID = require('./validateUUID')
const {
  ensureLock,
  activateLock,
  deactivateLock,
  checkLock
} = require('./lock')

module.exports = {
  chainValidators,
  checkBody,
  getFeedHandlers,
  getPrices,
  getTrackedCoins,
  validateBasicAuth,
  validateUUID,
  ensureLock,
  activateLock,
  deactivateLock,
  checkLock
}
