import {
  TransactionBitcoinFamilyRecord,
  TransactionBTCRecord,
  TransactionETHRecord,
  TransactionRecord
} from '../records'

export function parseTransaction (transaction, currency, message) {
  if (transaction.isCoinBase) {
    return new TransactionBitcoinFamilyRecord(transaction, {
      currency: currency,
      noAddress: message
    })
  } else if (currency === 'BTC') {
    return new TransactionBTCRecord(transaction, {
      noAddress: message
    })
  } else if (currency === 'ETH') {
    return new TransactionETHRecord(transaction, {
      noAddress: message
    })
  } else {
    return new TransactionRecord(transaction, {
      currency: currency,
      noAddress: message
    })
  }
}
