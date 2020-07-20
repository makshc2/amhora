export class AddressETHRecord {
  constructor (addressETHRecord) {
    this.record = addressETHRecord
  }

  get balance () {
    return this.record.balance
  }

  get pendingBalance () {
    return this.record.pending_balance
  }

  get address () {
    return this.record.address
  }

  get totalReceived () {
    return this.record.total_received
  }

  get totalTransactions () {
    return this.record.total_transactions
  }
}
