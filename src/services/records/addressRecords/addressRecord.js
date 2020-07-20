export class AddressRecord {
  constructor (addressRecord) {
    this.record = addressRecord || {}
  }

  get confirmedBalance () {
    if (this.record.balance && this.record.unconfirmedBalance) {
      return this.record.balance - this.record.unconfirmedBalance
    } else {
      return undefined
    }
  }

  get pendingBalance () {
    return this.record.unconfirmedBalance
  }

  get balance () {
    return this.record.balance
  }

  get totalBalance () {
    return this.balance
  }

  get totalReceived () {
    return this.record.totalReceived
  }

  get totalSent () {
    return this.record.totalSent
  }

  get totalTransactions () {
    return this.record.txAppearances
  }

  get address () {
    return this.record.addrStr
  }

  get unconfirmedBalance () {
    return this.record.unconfirmedBalance
  }

  get transactionsAppearances () {
    return this.totalTransactions
  }
}
