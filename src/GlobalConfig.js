// const host = location.host.indexOf(':') > 0 ? 'amhora.com' : location.host
const domain = location.host.slice(0, location.host.indexOf(':'))
const host = domain === 'amhora.com' ? 'amhora.com' : 'main.amhora.dev'
export const config = {
  apiServer: 'https://' + host + '/v1/',
  newApiServer: 'https://' + host + '/wallet_api/v1/',
  wsServer: 'https://' + host + '/_ws/',
  wsLink: 'wss://' + host + '/_ws/subscribe',
  btcFamilyCoins: ['BTC', 'BCH', 'DSH', 'LTC'],
  centrifugeLink: 'wss://' + host + '/connection/websocket'
}

export const newConfig = {
  newApiServer: 'https://' + host + '/wallet_api/v1/'
}
