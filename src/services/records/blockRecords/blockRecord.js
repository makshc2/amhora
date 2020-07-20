import { COINS } from '../../../constants/coins'

export class BlockRecord {
  // opts:
  // opts.unknowText – text for empty information about miner
  // opts.currency – selected currency
  // opts.block – ???

  constructor (blockRecord, opts) {
    this.record = blockRecord
    this.unknowText = opts.unknowText
    this.currency = opts.currency
    this.block = opts.block
  }

  get blockTime () { return this.record.block_time }

  get confirmations () { return this.record.confirmations }

  get miner () {
    return this.record.miner === undefined ? this.unknowText : this.record.miner
  }

  get hash () { return this.record.hash }

  get version () { return this.record.version }

  get blockReward () { return this.record.block_reward }

  get miningFees () { return this.record.mining_fees }

  get averageTransactionVolume () { return this.record.average_transaction_volume }

  get transactionCount () { return this.record.tx_count }

  get size () { return this.record.size }

  get nonce () { return this.record.nonce }

  get difficulty () { return this.record.difficulty }

  get transactionVolume () { return this.record.transaction_volume }

  get height () {
    return this.currency === COINS.eth ? this.block : this.record.height
  }
}
