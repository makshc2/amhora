export class BlockRecordBitcoinFamily {
  constructor (blockRecordBitcoinFamily) {
    this.record = blockRecordBitcoinFamily
  }

  get blockTime () {
    return this.record.time
  }

  get confirmations () {
    return this.record.confirmations
  }

  get hash () {
    return this.record.hash
  }

  get difficulty () {
    return this.record.difficulty
  }

  get nonce () {
    return this.record.nonce
  }

  get size () {
    return this.record.size
  }

  get version () {
    return this.record.version
  }

  get transactionsCount () {
    return this.record.tx_count
  }

  get height () {
    return this.record.height
  }
}
