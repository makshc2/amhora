export class TransactionInputValueRecord {
  constructor (transactionInputValueRecord) {
    this.record = transactionInputValueRecord
  }

  get addr () { return this.record.addr ? this.record.addr : 'Address unavailable' }

  get confirmations () { return this.record.confirmations }

  get doubleSpentTxID () { return this.record.doubleSpentTxID }

  get isConfirmed () { return this.record.isConfirmed }

  get n () { return this.record.n }

  get scriptSig () {
    return {
      asm: this.record.scriptSig.asm,
      hex: this.record.scriptSig.hex
    }
  }

  get sequence () { return this.record.sequence }

  get txid () { return this.record.txid }

  get unconfirmedInput () { return this.record.unconfirmedInput }

  get value () { return this.record.value }

  get valueSat () { return this.record.valueSat }

  get vout () { return this.record.vout }
}
