import axios from 'axios'
import apiUrls from '@/services/api-urls'

export default {
  namespaced: true,
  state: {
    walletList: [],
    supportCurrency: ['btc', 'bch', 'eth', 'ltc', 'dash']
  },
  actions: {
    async addMissingWallets ({ state, commit }, seed) {
      return axios.get(apiUrls.get_missing_wallet)
        .then(res => {
          let missingCurrency = res.data
          let baseOfWallets = []
          missingCurrency.forEach(async item => {
            if (state.supportCurrency.includes(item)) {
              const { generateWallet } = require('../../plugin/cryptoWalletGenerate/' + item)
              let currency = await generateWallet(seed)
              let walletAddress = await axios.post(apiUrls.wallet, currency)
              let setAddress = await axios.post(apiUrls.address + `/${walletAddress.data.id}`, {
                walletID: walletAddress.data.id,
                address: currency.address,
                derivation: currency.derivationCode,
                derivationNum: currency.index,
                createdAt: walletAddress.data.createdAt
              })
              baseOfWallets.push(walletAddress)
            }
          })
        })
    }
    // getters: {
    //   getUserWallets: state => state.walletList
    // }
  }
}
