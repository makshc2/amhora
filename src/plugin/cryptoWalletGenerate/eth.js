/* eslint-disable */
let Web3 = require('web3')
let privateKeyUtils = require('ethereum-mnemonic-privatekey-utils')
let hdkey = require("ethereumjs-wallet/hdkey");

export {generateWallet,signTransaction,generatePrivateKey}

function generateWallet(seed) {
    let seedArr = new Buffer(seed, 'hex')

    let hdWallet = hdkey.fromMasterSeed(seedArr)

    let derivePath = "m/44'/60'/0'/0/0"

    let wallet = hdWallet.derivePath(derivePath).getWallet()

    let address = "0x" + wallet.getAddress().toString("hex")
    let privateKey = wallet.getPrivateKey().toString("hex");

    return {
        address: address,
        currency: 'eth',
        derivation: derivePath,
        derivationCode: derivePath,
        privateKey: privateKey,
        index: 0
    }

}

async function signTransaction(txBody, seed) {
    let seedArr = new Buffer(seed, 'hex')

    let hdWallet = hdkey.fromMasterSeed(seedArr)

    let derivePath = "m/44'/60'/0'/0/0"

    let wallet = hdWallet.derivePath(derivePath).getWallet()

    let privateKey = wallet.getPrivateKey().toString("hex");

    const LINK_PROVIDER = "https://ropsten.infura.io/v3/f80fe1d60b564f01bacbe76341c9f679"

    delete txBody.v
    delete txBody.r
    delete txBody.s

    let web3 = new Web3(LINK_PROVIDER)
    let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
    web3.eth.accounts.wallet.add(account)

    await web3.eth.accounts.signTransaction(txBody, account.privateKey
    ).then(res => {
        delete txBody.chainId
        delete txBody.networkId
        txBody.v = res.v
        txBody.r = res.r
        txBody.s = res.s
    })
    return txBody
}

function generatePrivateKey(seed) {
  let allPrivateKey = []
  let seedArr = new Buffer(seed, 'hex')
  let hdWallet = hdkey.fromMasterSeed(seedArr)
  let derivePath = "m/44'/60'/0'/0/0"
  let wallet = hdWallet.derivePath(derivePath).getWallet()
  let privateKey = "0x"+wallet.getPrivateKey().toString("hex")
  allPrivateKey.push(privateKey)
  return allPrivateKey
}
