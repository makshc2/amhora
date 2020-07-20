import { TransactionInputValueRecord } from './transactionInputValueRecord'
import { TransactionOutputValueRecord } from './transactionOutputValueRecord'

const SATOSHI_С = 100000000
export class TransactionRecord {
  constructor (transactionRecord, opts) {
    this.record = transactionRecord
    this.fiat = opts.fiat
    this.noAddressMsg = opts.noAddress
  }

  get hash () { return this.record.txid }

  get version () { return this.record.version }

  get lockTime () { return this.record.lockTime }

  get input () {
    if (!this.record.vin) {
      return
    }
    return this.record.vin.map(item => {
      return new TransactionInputValueRecord(item)
    })
  }

  get output () {
    if (!this.record.vout) {
      return
    }
    return this.record.vout.map(item => {
      return new TransactionOutputValueRecord(item, this.noAddressMsg)
    })
  }

  get fees () {
    return (this.record.fees !== undefined && +this.record.fees !== 0)
      ? (+this.record.fees).toFixed(8)
      : 0
  }

  get feesSatB () {
    return (this.record.fees !== undefined && this.record.fees !== 0)
      ? (((+this.record.fees * SATOSHI_С) /
        +this.record.size).toFixed(8)) +
        ' sat/B'
      : null
  }

  get blockHash () { return this.record.blockHash }

  get blockHeight () { return this.record.blockHeight }

  get confirmations () {
    return this.record.confirmations !== undefined ? this.record.confirmations : null
  }

  get outcoming () { return 'coming' }

  get date () {
    return this.record.time !== undefined ? this.record.time : null
  }

  get blockTime () { return this.record.blockTime }

  get amount () { return this.record.valueOut }

  get size () { return this.record.size + ' BYTE' }

  get originalValue () {
    return this.record.original_value
      ? this.record.original_value + ' ' + this.fiat
      : null
  }
}
