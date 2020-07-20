import { TransactionInputValueRecord } from './transactionInputValueRecord'
import { TransactionOutputValueRecord } from './transactionOutputValueRecord'

const SATOSHI_С = 100000000

export class TransactionBTCRecord {
  constructor (transactionBTCRecord, opts) {
    this.record = transactionBTCRecord
    this.noAddressMsg = opts.noAddress
  }

  get hash () { return this.record.txid }

  get version () { return this.record.version }

  get lockTime () { return this.record.locktime }

  get blockHash () { return this.record.blockhash }

  get blockHeight () { return this.record.blockheight }

  get blockTime () { return this.record.blocktime }

  get input () {
    return this.record.vin.map(item => {
      return new TransactionInputValueRecord(item)
    })
  }

  get output () {
    return this.record.vout.map(item => {
      return new TransactionOutputValueRecord(item, this.noAddressMsg)
    })
  }

  get feePerWeightUnit () { return this.record.hasSegwit ? this.record.feePerWeightUnit : false }

  get size () { return this.record.size + ' BYTE' }

  get weight () { return this.record.hasSegwit ? this.record.weight : false }

  get amount () { return this.record.valueOut }

  get confirmations () {
    return this.record.confirmations !== undefined ? this.record.confirmations : null
  }

  get fees () {
    return (this.record.fees !== undefined && +this.record.fees !== 0)
      ? (+this.record.fees).toFixed(8)
      : 0
  }

  get date () {
    return this.record.time !== undefined ? this.record.time : null
  }

  get feesSatB () {
    return (this.record.feePerByte !== undefined && this.record.feePerByte !== 0)
      ? (((+this.record.feePerByte * SATOSHI_С) /
        +this.record.size).toFixed(8)) +
        ' sat/B'
      : null
  }
}
