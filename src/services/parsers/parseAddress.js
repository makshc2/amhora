import {
  AddressBTCRecord,
  AddressETHRecord,
  AddressRecord
} from '../records'

export function parseAddress (address, currency) {
  switch (currency) {
    case 'BTC': return new AddressBTCRecord(address)
    case 'ETH': return new AddressETHRecord(address)
    default: return new AddressRecord(address)
  }
}
