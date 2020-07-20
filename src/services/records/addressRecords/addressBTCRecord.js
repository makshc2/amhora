export class AddressBTCRecord {
  constructor (addressBTCRecord) {
    this.record = addressBTCRecord
  }

  get address () {
    return this.record.addrStr
  }

  get balanceSat () {
    return this.record.balanceSat
  }

  get balance () {
    return this.record.balance
  }

  get unconfirmedBalanceSat () {
    return this.record.unconfirmedBalanceSat
  }

  get unconfirmedBalance () {
    return this.record.unconfirmedBalance
  }

  get transactionsAppearances () {
    return this.record.txAppearances
  }

  get totalReceivedSat () {
    return this.record.totalReceivedSat
  }

  get totalReceived () {
    return this.record.totalReceived
  }

  get totalSentSat () {
    return this.record.totalSentSat
  }

  get totalSent () {
    return this.record.totalSent
  }
}
