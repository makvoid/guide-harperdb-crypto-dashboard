'use strict'

const fs = require('fs').promises
const lockFile = require('proper-lockfile')

/**
 * Ensure a lock file exists
 *
 * @param {string} lockPath path to the lock
 * @returns void
 */
const ensureLock = async (lockPath) => {
  try {
    await fs.writeFile(lockPath, '', { flag: 'wx' })
  } catch (_) {
    return null
  }
}

/**
 * Activate a lock
 *
 * @param {string} lockPath path to the lock file
 * @returns void
 */
const activateLock = async (lockPath) => {
  await ensureLock(lockPath)
  await lockFile.lock(lockPath)
}

/**
 * Deactivate a lock
 *
 * @param {string} lockPath path to the lock file
 * @returns void
 */
const deactivateLock = async (lockPath) => {
  await ensureLock(lockPath)
  await lockFile.unlock(lockPath)
}

/**
 * Check the status of a lock
 *
 * @param {string} lockPath path to the lock file
 * @returns void
 */
const checkLock = async (lockPath) => {
  await ensureLock(lockPath)
  return await lockFile.check(lockPath)
}

module.exports = {
  ensureLock,
  activateLock,
  deactivateLock,
  checkLock
}
