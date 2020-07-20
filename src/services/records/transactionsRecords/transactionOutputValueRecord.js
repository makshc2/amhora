export class TransactionOutputValueRecord {
  constructor (transactionOutputValueRecord, opts) {
    this.record = transactionOutputValueRecord
    this.noAddressMsg = opts.noAddress
  }

  get n () { return this.record.n }

  get scriptPubKey () {
    return {
      addresses: this._extractAddress(this.record.scriptPubKey.addresses),
      asm: this.record.scriptPubKey.asm,
      hex: this.record.scriptPubKey.hex,
      type: this.record.scriptPubKey.type
    }
  }

  get spentHeight () { return this.record.spentHeight }

  get spentIndex () { return this.record.spentIndex }

  get spentTxId () { return this.record.spentTxId }

  get value () { return Number(this.record.value) }

  _extractAddress (source) {
    return {
      string (src) { return src },
      object (src) { return Array.isArray(src) ? src[0] : this.noAddressMsg },
      undefined () { return this.noAddressMsg }
    }[typeof source](source)
  }
}
