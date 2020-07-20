export class TransactionETHRecord {
  constructor (transactionETHRecord) {
    this.record = transactionETHRecord
  }

  get blockHash () { return this.record.blockHash }

  get confirmations () { return this.record.confirmations }

  get blockNumber () { return this.record.blockNumber }

  get from () { return this.record.from }

  get input () { return this.record.from }

  get gas () { return this.record.gas }

  get gasPrice () { return this.record.gasPrice }

  get hash () { return this.record.hash }

  get nonce () { return this.record.nonce }

  get output () { return this.record.to }

  get transactionIndex () { return this.record.transactionIndex }

  get value () { return this.record.value }

  get v () { return this.record.v }

  get r () { return this.record.r }

  get s () { return this.record.s }
}
