/* eslint-disable */
let hdkey = require('hdkey')
let createHash = require('create-hash')
let bitcoin = require('bitcoinjs-lib')
let bs58check = require('bs58check')
import BitcoinCash from 'bitcore-lib-cash'

const wif = require('wif')

const BCH_TESTNET_NETWORK = {
    messagePrefix: '\x19Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: { // can't find
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239,
}

const BCH_MAINNET_NETWORK = {
    messagePrefix: '\x19Bitcoin Signed Message:\n',
    bech32: 'bc',
    // bip32: { // can't find
    //     public: 0x019da462,
    //     private: 0x019d9cfe,
    // },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128,
}

export {generateWallet, signTransaction, generatePrivateKey}

function generateWallet(seed, index = 0) {
    const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
    const masterPrivateKey = root.privateKey.toString('hex');

    console.log('Master Private : ', masterPrivateKey);

    const addrnode = root.derive(`m/44'/1'/1'/0/${index}`);

    //BCH 1
    //LTC 2

    // const addrnode = root.derive("m/44'/1'/0'/0/0");

    // const addrnode = root.derive("m/44'/1'/0'/0/0"); => Testnet LTC && BTC && BCH
    //
    //     // const addrnode = root.derive("m/44'/0'/0'/0/0"); => BTC
    //     // const addrnode = root.derive("m/44'/2'/0'/0/0"); => LTC
    //     // const addrnode = root.derive("m/44'/145'/0'/0/0"); => BCH

    // console.log('hdkey pbx : ' ,root.publicExtendedKey);

    /// Private and Public Key
    const rawPbK = Buffer.from(addrnode._publicKey);
    const rawPvK = addrnode._privateKey;

    /// Hashing the raw publiv key

    const hash1pbk = createHash('sha256').update(rawPbK).digest();
    const hash1rmd = createHash('rmd160').update(hash1pbk).digest();

    let pubAddr = Buffer.allocUnsafe(21);

    // Adding testnet prefix
    pubAddr.writeUInt8(0x6f, 0);
    // pubAddr.writeUInt8(0x30, 0); => LTC
    // pubAddr.writeUInt8(0x00, 0); => BCH && BTC

    hash1rmd.copy(pubAddr, 1);

    let pbAddr = bs58check.encode(pubAddr);

    return {
        address: pbAddr,
        currency: 'bch',
        derivationCode: `m/44'/1'/1'/0/${index}`,
        index: index,
        derivation: addrnode,
        privateKey: rawPvK
    }
}

async function signTransaction(txHex, seed, addresses) {
    const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))

    let tx = bitcoin.Transaction.fromHex(txHex.tx_hex)

    let privateKeys = []
    let utxos = []
    let derivationIndexes = []

    let transaction = new BitcoinCash.Transaction()

    txHex.inputs.forEach((item, index) => {
        let input = item
        let prevTx = bitcoin.Transaction.fromHex(input.tx_hex)
        let address = bitcoin.address.fromOutputScript(prevTx.outs[input.index].script, BCH_TESTNET_NETWORK)
        let script = prevTx.outs[input.index].script.toString('hex')

        let amount = prevTx.outs[input.index].value

        let utxo = {
            'txId': input.tx_id,
            'outputIndex': input.index,
            'address': address,
            'script': script,
            'satoshis': amount
        }

        utxos.push(utxo)

        derivationIndexes.push(addresses[address])
    })

    transaction.from(utxos)

    tx.outs.forEach(item => {
        let address = bitcoin.address.fromOutputScript(item.script, BCH_TESTNET_NETWORK)
        let amount = item.value
        transaction.to(address, amount)
    })

    derivationIndexes.forEach(item => {
        const DERIVE = root.derive(`m/44'/1'/1'/0/${item}`),
            KEY_PAIR = bitcoin.ECPair.fromPrivateKey(DERIVE.privateKey, BCH_TESTNET_NETWORK),
            WIF = KEY_PAIR.toWIF()
        privateKeys.push(WIF)
    })

    let signedTx = transaction.sign(privateKeys, 0x01 | 0x40)

    return {
        transaction: signedTx.serialize()
    }
}

function generatePrivateKey(seed, derivationNum) {
  let allPrivateKey = []
  const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
  const addrnode = root.derive(`m/44'/1'/1'/0/${derivationNum}`)
  const keyPair = bitcoin.ECPair.fromPrivateKey(addrnode.privateKey, { network: BCH_TESTNET_NETWORK })
  allPrivateKey.push(keyPair.toWIF())
  return allPrivateKey
}
