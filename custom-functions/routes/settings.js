'use strict'

const { validateBasicAuth } = require('../helpers')

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/settings',
    method: 'GET',
    preValidation: (request) => validateBasicAuth(request, hdbCore, logger),
    handler: async (request) => {
      // Get all tracked coins
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.tracked ORDER BY __createdtime__ ASC'
      }
      const trackedCoins = await hdbCore.requestWithoutAuthentication(request)

      // Top 100 coins as of week one of September '22
      const coinList = ['bitcoin', 'ethereum', 'tether', 'usd-coin', 'bnb', 'binance-usd', 'xrp', 'cardano', 'solana', 'polkadot-new', 'dogecoin', 'polygon', 'multi-collateral-dai', 'shiba-inu', 'avalanche', 'tron', 'ethereum-classic', 'wrapped-bitcoin', 'unus-sed-leo', 'uniswap', 'litecoin', 'cosmos', 'chainlink', 'near-protocol', 'ftx-token', 'terra-luna', 'cronos', 'monero', 'stellar', 'bitcoin-cash', 'algorand', 'flow', 'vechain', 'internet-computer', 'filecoin', 'eos', 'tezos', 'decentraland', 'apecoin-ape', 'the-sandbox', 'hedera', 'quant', 'aave', 'elrond-egld', 'chiliz', 'axie-infinity', 'theta-network', 'trueusd', 'bitcoin-sv', 'okb', 'paxos-standard', 'zcash', 'kucoin-token', 'bittorrent-new', 'ecash', 'iota', 'huobi-token', 'the-graph', 'usdd', 'maker', 'synthetix', 'neo', 'klaytn', 'fantom', 'neutrino-usd', 'thorchain', 'helium', 'curve-dao-token', 'lido-dao', 'pancakeswap', 'pax-gold', 'enjin-coin', 'dash', 'nexo', 'basic-attention-token', 'waves', 'stacks', 'zilliqa', 'loopring', 'mina', 'gatetoken', 'kusama', 'fei-usd', 'terrausd', 'kava', 'bitcoin-gold', 'gnosis-gno', 'decred', 'trust-wallet-token', 'nem', 'green-metaverse-token', 'ravencoin', 'celo', '1inch', 'gemini-dollar', 'convex-finance', 'compound', 'holo', 'arweave', 'ankr']

      // Get all feeds configured
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.feed_handlers ORDER BY __createdtime__ ASC'
      }
      const feeds = await hdbCore.requestWithoutAuthentication(request)

      // Get all feed categories configured
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM crypto.feed_categories ORDER BY __createdtime__ ASC'
      }
      const categories = await hdbCore.requestWithoutAuthentication(request)

      return {
        trackedCoins,
        coinList,
        feeds,
        categories
      }
    }
  })
}
